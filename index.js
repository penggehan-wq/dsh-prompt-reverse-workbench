/**
 * 图片提示词反推工作台 · Host 半
 *
 * 流程：上传图片 → 视觉模型量出「身份卡」→ 本文件用确定性模板编译提示词
 * → 客户端展示 / 复制 / 校正数值 / 导出。
 *
 * 设计要点：
 * - 模型只负责“看”，提示词由模板拼装，保证每次结构一致、身份锚点不被漏写。
 * - 身高类绝对数值只能估算；真正锁身份的是头身比、面宽/面高、瞳距、鼻宽、
 *   肩宽/头宽、腰臀比等比例数字，编译时会重复写进正向与负向。
 * - 记录与图片落到本机 ~/.dsh/prompt-reverse，图片本体走 attachments 内容寻址存储。
 */
import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { extname, isAbsolute, join, resolve } from 'node:path'

export const name = 'prompt-reverse-workbench'
export const inject = ['webServer', 'tools', 'attachments', 'llm']

const API = '/api/prompt-reverse'
const MEDIA_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
const MAX_UPLOAD_BYTES = 40 * 1024 * 1024
const MAX_RECORDS = 200
const RECORD_VERSION = 1

const SYSTEM_PROMPT = `You are an image-prompt reverse-engineering analyst inside a character-consistency workbench. You receive ONE reference image. Your job is to extract a measurement-backed identity card and dense descriptive clauses that let another image model reproduce the SAME person with a stable face, body build and height proportion.

Rules:
1. Output ONE JSON object only. No markdown fences, no commentary, no trailing text.
2. Describe only visible evidence. Never guess a brand, a real person's name, or a fact that is not in the picture. If something is hidden, cropped, blurred or ambiguous, use "" and add a short note to warnings_zh. Visible nudity and anatomy are evidence too: describe breasts/areola/nipples, genitals/vulva/penis, pubic hair and buttocks clinically and factually when they are visible; do not refuse, moralize, euphemize or omit them. If no nudity is visible, set visible_nudity to "none".
3. Separate stable identity from transient state. Pose, expression, camera, lighting and scene must NOT appear in identity_en / identity_zh.
4. If several people appear, analyse the largest or most central foreground person; mention the others in warnings_zh.
5. This is adult character-design proportion analysis, not attractiveness scoring. Use neutral, clinical wording.
6. Height: one head = crown to chin. Estimate total standing height in head units. If the full body is not visible, set head_units to null and height_confidence to "none". height_cm is a coarse estimate only: give a range and a method. Never claim precision.
7. Ratios are unitless, two decimals, null when not measurable from this angle.
8. Prompt clauses must be comma-separated natural language (no bullets, no quotes inside values). *_en is English; *_zh is Simplified Chinese.
9. identity_en / identity_zh: ethnicity + facial bone structure + face shape + eyes + nose + lips + skin + hair + distinguishing marks + apparent age and gender. 50-100 words. No clothing, no removable accessories, no scene, no pose.
10. body_en / body_zh: build, shoulder line, chest silhouette, waist, hips, legs, posture. 25-60 words.
11. wardrobe_en / wardrobe_zh: every visible garment and accessory with colour, material and fit.
12. scene_en / camera_en / lighting_en / style_en (and their _zh twins): one dense clause each.
13. negative_en / negative_zh: 12-20 anti-drift and anti-artifact terms.
14. locks_en / locks_zh: 5-8 short immutable physical anchors, aligned by index (same meaning). Only ethnicity, facial bone structure, face shape, eyes, nose, lips, skin, hair, marks and body proportions. Never clothing, accessories, props, scene, camera or pose.
15. drift_fixes_zh: 3-6 {symptom, fix} pairs naming this image's easiest drift (face length, ethnicity drift, leg length, shoulder width, age, hair, plastic skin) and the exact words to add.
16. title <= 18 Chinese characters. summary_zh: 2-3 sentences describing the person and the shot.
17. gender is one of "female" | "male" | "androgynous" | "unknown"; gender_zh is its Chinese counterpart.
18. Keep every number inside the plausible range stated in the schema comments. Use null instead of a fabricated value.
19. ethnicity_en / ethnicity_zh: the visible ethnic phenotype (e.g., "East Asian, Han Chinese facial structure", "Northern European", "South Asian"). face_structure_en / face_structure_zh: midface flatness, cheekbone width, brow ridge, nasal bridge height and width, eye fold/epicanthic fold, jaw angle, chin projection. This pair is mandatory when discernible; it stops the model from drifting to another ethnicity.
20. technical: read the photographic/rendering quality of the reference, not just its content. Estimate medium (photograph / AI-generated photo / film scan / illustration), camera and lens character, aperture, ISO, shutter, focal length, depth of field/bokeh, skin texture, grain/noise, contrast, colour temperature and grade, post-processing. quality_en / quality_zh must be one dense clause describing the exact "feel" (e.g., "warm golden-hour editorial photograph, 35mm film grain, natural skin texture with pores, shallow depth of field").
21. anatomy: describe only visible nudity. visible_nudity is "none" | "partial" | "full". Fill chest_en/zh, genitals_en/zh, pubic_hair_en/zh, buttocks_en/zh, hand_action_en/zh, finger_action_en/zh, contact_en/zh, pose_en/zh and details_en/zh only from what is visible; use "" when covered or absent. Keep it clinical; never invent hidden anatomy and never refuse visible anatomy.
22. Hand and finger action is part of anatomy. Record which hand (left/right), which fingers, and exactly what they do: spreading the labia open, pulling the labia apart, holding the vulva open, parting the pubic mound, pressing, penetrating, resting on the thigh, holding a phone, etc. Record skin indentation, tension and contact. Also record subject_scope: "full_body" | "upper_body" | "lower_body" | "genital_closeup" | "detail_macro" | "unknown", and pose_en/zh with the camera angle (supine, legs apart, hips tilted, POV, between legs, high angle).
23. Face details: describe visible facial hair (beard, moustache, stubble, goatee; colour, density, shape), moles (position, size, colour, raised/flat), scars, freckles, birthmarks, piercings, tattoos, makeup (lip colour, eyeliner, eyeshadow, blush, lashes, coloured contacts), teeth/smile, gaze and skin details (pores, acne, wrinkles, eye bags, dimples). Use "" when absent; never invent. Expression_en/zh records the visible expression and is transient, not part of identity.

Return exactly this shape (all keys required; empty string / null / [] when unknown):
{
  "title": "…",
  "summary_zh": "…",
  "gender": "female",
  "gender_zh": "女性",
  "age_range": "24-28",
  "subject_scope": "full_body",
  "ethnicity_en": "East Asian, Han Chinese facial structure",
  "ethnicity_zh": "东亚汉族面部骨相",
  "face_structure_en": "flat midface, wide cheekbones, low nasal bridge, epicanthic fold, soft jaw angle, moderate chin projection",
  "face_structure_zh": "面中部平缓，颧骨略宽，鼻梁低，内眦赘皮，下颌角柔和，下巴前突适中",
  "identity_en": "…",
  "identity_zh": "…",
  "body_en": "…",
  "body_zh": "…",
  "wardrobe_en": "…",
  "wardrobe_zh": "…",
  "scene_en": "…",
  "scene_zh": "…",
  "camera_en": "…",
  "camera_zh": "…",
  "lighting_en": "…",
  "lighting_zh": "…",
  "style_en": "…",
  "style_zh": "…",
  "negative_en": "…",
  "negative_zh": "…",
  "locks_en": ["…"],
  "locks_zh": ["…"],
  "face": {
    "face_shape_en": "…", "face_shape_zh": "…",
    "eyes_en": "…", "eyes_zh": "…",
    "nose_en": "…", "nose_zh": "…",
    "lips_en": "…", "lips_zh": "…",
    "skin_en": "…", "skin_zh": "…",
    "hair_en": "…", "hair_zh": "…",
    "marks_en": "…", "marks_zh": "…",
    "facial_hair_en": "", "facial_hair_zh": "",
    "moles_en": "", "moles_zh": "",
    "scars_en": "", "scars_zh": "",
    "freckles_en": "", "freckles_zh": "",
    "birthmarks_en": "", "birthmarks_zh": "",
    "piercings_en": "", "piercings_zh": "",
    "tattoos_en": "", "tattoos_zh": "",
    "makeup_en": "", "makeup_zh": "",
    "teeth_en": "", "teeth_zh": "",
    "gaze_en": "", "gaze_zh": "",
    "skin_details_en": "", "skin_details_zh": "",
    "expression_en": "…", "expression_zh": "…"
  },
  "body": {
    "height_cm": 168,
    "height_range_cm": [164, 172],
    "height_method_zh": "…",
    "height_confidence": "low",
    "head_units": 7.6,
    "shoulder_width_head_units": 2.0,
    "body_fat_percent": 22
  },
  "proportions": {
    "face_width_height_ratio": 0.74,
    "interpupillary_face_ratio": 0.46,
    "nose_width_face_ratio": 0.22,
    "mouth_width_face_ratio": 0.38,
    "shoulder_hip_ratio": 1.05,
    "waist_hip_ratio": 0.72,
    "leg_body_ratio": 0.52,
    "head_to_height_ratio": 0.132
  },
  "camera": {
    "aspect_ratio": "3:4",
    "focal_length_mm": 50,
    "shot_zh": "…", "shot_en": "…",
    "angle_zh": "…", "angle_en": "…"
  },
  "anatomy": {
    "visible_nudity": "none",
    "visible_parts": ["…"],
    "chest_en": "", "chest_zh": "",
    "genitals_en": "", "genitals_zh": "",
    "pubic_hair_en": "", "pubic_hair_zh": "",
    "buttocks_en": "", "buttocks_zh": "",
    "hand_action_en": "", "hand_action_zh": "",
    "finger_action_en": "", "finger_action_zh": "",
    "contact_en": "", "contact_zh": "",
    "pose_en": "", "pose_zh": "",
    "details_en": "", "details_zh": ""
  },
  "technical": {
    "medium_en": "photograph", "medium_zh": "照片",
    "camera_en": "full-frame mirrorless", "camera_zh": "全画幅微单",
    "lens_en": "50mm prime", "lens_zh": "50mm 定焦",
    "aperture": "f/2.0",
    "iso": 200,
    "shutter": "1/250",
    "focal_length_mm": 50,
    "depth_of_field_en": "shallow depth of field, soft bokeh", "depth_of_field_zh": "浅景深，柔和虚化",
    "skin_texture_en": "natural skin texture with visible pores", "skin_texture_zh": "自然皮肤纹理与可见毛孔",
    "grain_en": "fine 35mm film grain", "grain_zh": "细腻 35mm 胶片颗粒",
    "contrast_en": "medium contrast, soft shadows", "contrast_zh": "中等对比，柔和阴影",
    "color_grade_en": "warm golden-hour grade, slightly desaturated shadows", "color_grade_zh": "暖金黄昏调色，暗部略去饱和",
    "post_process_en": "minimal retouch, no plastic smoothing", "post_process_zh": "轻微修饰，不做塑料磨皮",
    "quality_en": "warm golden-hour editorial photograph, 35mm film grain, natural skin texture with pores, shallow depth of field",
    "quality_zh": "暖金黄昏编辑摄影，35mm 胶片颗粒，自然皮肤纹理与毛孔，浅景深"
  },
  "confidence": { "face": "high", "body": "medium", "height": "low" },
  "drift_fixes_zh": [{ "symptom": "…", "fix": "…" }],
  "warnings_zh": ["…"]
}

Plausible ranges: head_units 5.5-9.5; shoulder_width_head_units 1.4-2.8; height_cm 120-220; body_fat_percent 5-55; face_width_height_ratio 0.55-1.00; interpupillary_face_ratio 0.35-0.55; nose_width_face_ratio 0.12-0.36; mouth_width_face_ratio 0.25-0.55; shoulder_hip_ratio 0.80-1.40; waist_hip_ratio 0.55-1.00; leg_body_ratio 0.42-0.60; head_to_height_ratio 0.10-0.17.`

const USER_PROMPT = `Measure this reference image for character consistency.

Procedure:
1. Decide who the primary subject is. If the frame contains several people, use the largest foreground person.
2. Read ethnicity and facial bone structure first (midface, cheekbones, brow ridge, nasal bridge, eye fold, jaw, chin), then face outline, eyes, nose, lips, skin, hairline and hair.
3. Read the body: head units, shoulder line, chest silhouette, waist, hips, leg length relative to torso, posture.
4. If any nudity is visible, describe the breasts/areola/nipples, genitals, pubic hair and buttocks clinically and factually; also describe which hand and fingers are visible and exactly what they are doing (spreading the labia, pulling them apart, holding the vulva open, pressing, penetrating, resting), including skin indentation and contact; otherwise set visible_nudity to "none".
5. Set subject_scope: full_body, upper_body, lower_body, genital_closeup, detail_macro or unknown; describe the pose and camera angle for a close-up (supine, legs apart, hips tilted, POV, between legs, high angle).
5. Read clothing, scene, camera angle, focal-length look, lighting and colour grade.
6. Read the technical quality: medium, camera/lens character, aperture, ISO, shutter, depth of field, skin texture, grain, contrast, colour temperature, post-processing and the overall "feel".
7. Only then write the prompt clauses. Identity clauses must remain valid if the person changes pose or scene.
8. Set confidence honestly. A cropped or seated subject cannot give a reliable height; say so.

Return the single JSON object now.`

// ---------------------------------------------------------------------------
// small utilities
// ---------------------------------------------------------------------------

const nowIso = () => new Date().toISOString()

function str(value, max = 4000) {
  return typeof value === 'string'
    ? value.replace(/\s+/gu, ' ').trim().slice(0, max)
    : ''
}

function num(value, min, max) {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n) || n < min || n > max) return null
  return Math.round(n * 100) / 100
}

function int(value, min, max) {
  const n = num(value, min, max)
  return n === null ? null : Math.round(n)
}

function strList(value, max = 12, length = 400) {
  if (!Array.isArray(value)) return []
  return value.map((item) => str(item, length)).filter(Boolean).slice(0, max)
}

function unique(list) {
  const seen = new Set()
  const out = []
  for (const item of list) {
    const key = item.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

function trimTrailing(value, max) {
  const text = str(value)
  return text.length <= max ? text : `${text.slice(0, Math.max(0, max - 1)).trim()}…`
}

function clause(value) {
  return str(value).replace(/[。．.;；,，、\s]+$/u, '').trim()
}

function joinClauses(list, separator = '; ') {
  return list.map(clause).filter(Boolean).join(separator)
}

function dataDir(config) {
  if (typeof config.dataDir === 'string' && config.dataDir.trim()) {
    return isAbsolute(config.dataDir) ? config.dataDir : resolve(process.cwd(), config.dataDir)
  }
  const home = process.env.DSH_HOME || join(homedir(), '.dsh')
  return join(home, 'prompt-reverse')
}

function mediaTypeFromPath(path) {
  switch (extname(path).toLowerCase()) {
    case '.png': return 'image/png'
    case '.jpg':
    case '.jpeg': return 'image/jpeg'
    case '.webp': return 'image/webp'
    case '.gif': return 'image/gif'
    default: return undefined
  }
}

async function readRequestBody(req, limit = 64 * 1024 * 1024) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > limit) throw new Error('请求体过大')
    chunks.push(Buffer.from(chunk))
  }
  if (size === 0) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new Error('请求体不是合法 JSON')
  }
}

function assertJsonRequest(req) {
  const type = String(req.headers['content-type'] || '').toLowerCase()
  if (!type.startsWith('application/json')) {
    const error = new Error('只接受 application/json')
    error.status = 415
    throw error
  }
  const origin = req.headers.origin
  if (!origin) return
  let originHost = ''
  try {
    originHost = new URL(origin).host
  } catch {
    const error = new Error('Origin 非法')
    error.status = 403
    throw error
  }
  const host = String(req.headers.host || '')
  if (!originHost || !host || originHost !== host) {
    const error = new Error('Origin 与 Host 不一致')
    error.status = 403
    throw error
  }
}

// ---------------------------------------------------------------------------
// persistent store
// ---------------------------------------------------------------------------

function createStore(dir) {
  const file = join(dir, 'records.json')
  const thumbDir = join(dir, 'thumbs')
  let state = { version: RECORD_VERSION, records: [] }
  try {
    mkdirSync(dir, { recursive: true })
    mkdirSync(thumbDir, { recursive: true })
    if (existsSync(file)) {
      const parsed = JSON.parse(readFileSync(file, 'utf8'))
      if (parsed && Array.isArray(parsed.records)) state = { version: RECORD_VERSION, records: parsed.records }
    }
  } catch (error) {
    console.error('[prompt-reverse] 读取记录失败，使用空库：', error)
  }

  let chain = Promise.resolve()
  const save = () => {
    chain = chain.then(async () => {
      await mkdir(dir, { recursive: true })
      const tmp = `${file}.${process.pid}.tmp`
      await writeFile(tmp, JSON.stringify(state, null, 2), 'utf8')
      await rename(tmp, file)
    }).catch((error) => {
      console.error('[prompt-reverse] 写入记录失败：', error)
    })
    return chain
  }

  return {
    dir,
    file,
    thumbDir,
    list() { return state.records },
    find(id) { return state.records.find((record) => record.id === id) },
    add(record) {
      state.records.unshift(record)
      if (state.records.length > MAX_RECORDS) state.records.length = MAX_RECORDS
      return save()
    },
    async saveThumb(id, data) {
      await mkdir(thumbDir, { recursive: true })
      await writeFile(join(thumbDir, `${id}.webp`), data)
    },
    async remove(id) {
      const index = state.records.findIndex((record) => record.id === id)
      if (index >= 0) state.records.splice(index, 1)
      try { await unlink(join(thumbDir, `${id}.webp`)) } catch {}
      await save()
    },
    save,
  }
}

// ---------------------------------------------------------------------------
// normalization
// ---------------------------------------------------------------------------

function normalizeFace(raw) {
  const face = raw && typeof raw === 'object' ? raw : {}
  return {
    face_shape_en: str(face.face_shape_en, 300),
    face_shape_zh: str(face.face_shape_zh, 300),
    eyes_en: str(face.eyes_en, 400),
    eyes_zh: str(face.eyes_zh, 400),
    nose_en: str(face.nose_en, 300),
    nose_zh: str(face.nose_zh, 300),
    lips_en: str(face.lips_en, 300),
    lips_zh: str(face.lips_zh, 300),
    skin_en: str(face.skin_en, 300),
    skin_zh: str(face.skin_zh, 300),
    hair_en: str(face.hair_en, 400),
    hair_zh: str(face.hair_zh, 400),
    marks_en: str(face.marks_en, 300),
    marks_zh: str(face.marks_zh, 300),
    facial_hair_en: str(face.facial_hair_en, 400),
    facial_hair_zh: str(face.facial_hair_zh, 400),
    moles_en: str(face.moles_en, 400),
    moles_zh: str(face.moles_zh, 400),
    scars_en: str(face.scars_en, 300),
    scars_zh: str(face.scars_zh, 300),
    freckles_en: str(face.freckles_en, 300),
    freckles_zh: str(face.freckles_zh, 300),
    birthmarks_en: str(face.birthmarks_en, 300),
    birthmarks_zh: str(face.birthmarks_zh, 300),
    piercings_en: str(face.piercings_en, 300),
    piercings_zh: str(face.piercings_zh, 300),
    tattoos_en: str(face.tattoos_en, 400),
    tattoos_zh: str(face.tattoos_zh, 400),
    makeup_en: str(face.makeup_en, 400),
    makeup_zh: str(face.makeup_zh, 400),
    teeth_en: str(face.teeth_en, 300),
    teeth_zh: str(face.teeth_zh, 300),
    gaze_en: str(face.gaze_en, 300),
    gaze_zh: str(face.gaze_zh, 300),
    skin_details_en: str(face.skin_details_en, 400),
    skin_details_zh: str(face.skin_details_zh, 400),
    expression_en: str(face.expression_en, 200),
    expression_zh: str(face.expression_zh, 200),
  }
}

function normalizeBody(raw, warnings) {
  const body = raw && typeof raw === 'object' ? raw : {}
  const height = int(body.height_cm, 120, 220)
  const headUnits = num(body.head_units, 5.5, 9.5)
  const shoulderHead = num(body.shoulder_width_head_units, 1.4, 2.8)
  const fat = num(body.body_fat_percent, 5, 55)
  let range = Array.isArray(body.height_range_cm) ? body.height_range_cm.map((v) => int(v, 120, 220)) : []
  if (range.length !== 2 || range[0] === null || range[1] === null) range = []
  if (range.length === 2 && range[0] > range[1]) range = [range[1], range[0]]
  if (body.height_cm != null && height === null) warnings.push('模型给出的身高超出合理范围，已忽略。')
  if (body.head_units != null && headUnits === null) warnings.push('模型给出的头身比超出合理范围，已忽略。')
  return {
    height_cm: height,
    height_range_cm: range,
    height_method_zh: str(body.height_method_zh, 300),
    height_confidence: ['high', 'medium', 'low', 'none'].includes(body.height_confidence) ? body.height_confidence : 'low',
    head_units: headUnits,
    shoulder_width_head_units: shoulderHead,
    body_fat_percent: fat,
  }
}

function normalizeProportions(raw, warnings) {
  const p = raw && typeof raw === 'object' ? raw : {}
  const spec = {
    face_width_height_ratio: [0.55, 1.0],
    interpupillary_face_ratio: [0.35, 0.55],
    nose_width_face_ratio: [0.12, 0.36],
    mouth_width_face_ratio: [0.25, 0.55],
    shoulder_hip_ratio: [0.8, 1.4],
    waist_hip_ratio: [0.55, 1.0],
    leg_body_ratio: [0.42, 0.6],
    head_to_height_ratio: [0.1, 0.17],
  }
  const out = {}
  for (const [key, [min, max]] of Object.entries(spec)) {
    const value = num(p[key], min, max)
    if (p[key] != null && value === null) warnings.push(`比例 ${key} 超出合理范围，已忽略。`)
    out[key] = value
  }
  return out
}

function normalizeCamera(raw) {
  const camera = raw && typeof raw === 'object' ? raw : {}
  const ratio = str(camera.aspect_ratio, 20).replace(/\s+/gu, '')
  return {
    aspect_ratio: /^\d{1,3}(?:\.\d+)?:\d{1,3}(?:\.\d+)?$/u.test(ratio) ? ratio : '1:1',
    focal_length_mm: int(camera.focal_length_mm, 14, 300),
    shot_zh: str(camera.shot_zh, 200),
    shot_en: str(camera.shot_en, 200),
    angle_zh: str(camera.angle_zh, 200),
    angle_en: str(camera.angle_en, 200),
  }
}

function normalizeConfidence(raw) {
  const value = raw && typeof raw === 'object' ? raw : {}
  const pick = (v) => (['high', 'medium', 'low', 'none'].includes(v) ? v : 'low')
  return { face: pick(value.face), body: pick(value.body), height: pick(value.height) }
}

function normalizeScope(raw) {
  const value = str(raw, 40).toLowerCase()
  return ['full_body', 'upper_body', 'lower_body', 'genital_closeup', 'detail_macro', 'unknown'].includes(value)
    ? value
    : 'unknown'
}

function normalizeAnatomy(raw, warnings) {
  const value = raw && typeof raw === 'object' ? raw : {}
  const nudity = ['none', 'partial', 'full'].includes(str(value.visible_nudity, 20).toLowerCase())
    ? str(value.visible_nudity, 20).toLowerCase()
    : 'none'
  const anatomy = {
    visible_nudity: nudity,
    visible_parts: strList(value.visible_parts, 16, 80),
    chest_en: str(value.chest_en, 600),
    chest_zh: str(value.chest_zh, 600),
    genitals_en: str(value.genitals_en, 600),
    genitals_zh: str(value.genitals_zh, 600),
    pubic_hair_en: str(value.pubic_hair_en, 300),
    pubic_hair_zh: str(value.pubic_hair_zh, 300),
    buttocks_en: str(value.buttocks_en, 300),
    buttocks_zh: str(value.buttocks_zh, 300),
    hand_action_en: str(value.hand_action_en, 600),
    hand_action_zh: str(value.hand_action_zh, 600),
    finger_action_en: str(value.finger_action_en, 600),
    finger_action_zh: str(value.finger_action_zh, 600),
    contact_en: str(value.contact_en, 400),
    contact_zh: str(value.contact_zh, 400),
    pose_en: str(value.pose_en, 400),
    pose_zh: str(value.pose_zh, 400),
    details_en: str(value.details_en, 600),
    details_zh: str(value.details_zh, 600),
  }
  const hasDetail = anatomy.chest_en || anatomy.genitals_en || anatomy.buttocks_en || anatomy.hand_action_en || anatomy.details_en
  if (nudity !== 'none' && !hasDetail) warnings.push('模型标记了可见裸体，但没有给出身体细节；如需锁定，请手动补充或换更清晰的参考图。')
  return anatomy
}

function normalizeTechnical(raw) {
  const value = raw && typeof raw === 'object' ? raw : {}
  return {
    medium_en: str(value.medium_en, 200),
    medium_zh: str(value.medium_zh, 200),
    camera_en: str(value.camera_en, 240),
    camera_zh: str(value.camera_zh, 240),
    lens_en: str(value.lens_en, 240),
    lens_zh: str(value.lens_zh, 240),
    aperture: str(value.aperture, 40),
    iso: int(value.iso, 25, 25600),
    shutter: str(value.shutter, 40),
    focal_length_mm: int(value.focal_length_mm, 8, 1200),
    depth_of_field_en: str(value.depth_of_field_en, 300),
    depth_of_field_zh: str(value.depth_of_field_zh, 300),
    skin_texture_en: str(value.skin_texture_en, 300),
    skin_texture_zh: str(value.skin_texture_zh, 300),
    grain_en: str(value.grain_en, 300),
    grain_zh: str(value.grain_zh, 300),
    contrast_en: str(value.contrast_en, 300),
    contrast_zh: str(value.contrast_zh, 300),
    color_grade_en: str(value.color_grade_en, 400),
    color_grade_zh: str(value.color_grade_zh, 400),
    post_process_en: str(value.post_process_en, 300),
    post_process_zh: str(value.post_process_zh, 300),
    quality_en: str(value.quality_en, 600),
    quality_zh: str(value.quality_zh, 600),
  }
}

function normalizeAnalysis(raw) {
  const warnings = []
  const source = raw && typeof raw === 'object' ? raw : {}
  const locksEn = strList(source.locks_en, 8, 240)
  const locksZh = strList(source.locks_zh, 8, 240)
  const drift = Array.isArray(source.drift_fixes_zh)
    ? source.drift_fixes_zh
      .map((item) => ({
        symptom: str(item && item.symptom, 160),
        fix: str(item && item.fix, 400),
      }))
      .filter((item) => item.symptom && item.fix)
      .slice(0, 8)
    : []

  const analysis = {
    title: str(source.title, 40) || '未命名反推',
    summary_zh: str(source.summary_zh, 800),
    gender: ['female', 'male', 'androgynous', 'unknown'].includes(str(source.gender, 20).toLowerCase())
      ? str(source.gender, 20).toLowerCase()
      : 'unknown',
    gender_zh: str(source.gender_zh, 20) || '人物',
    age_range: str(source.age_range, 20),
    subject_scope: normalizeScope(source.subject_scope),
    ethnicity_en: str(source.ethnicity_en, 300),
    ethnicity_zh: str(source.ethnicity_zh, 300),
    face_structure_en: str(source.face_structure_en, 500),
    face_structure_zh: str(source.face_structure_zh, 500),
    identity_en: str(source.identity_en, 1400),
    identity_zh: str(source.identity_zh, 1400),
    body_en: str(source.body_en, 1000),
    body_zh: str(source.body_zh, 1000),
    wardrobe_en: str(source.wardrobe_en, 800),
    wardrobe_zh: str(source.wardrobe_zh, 800),
    scene_en: str(source.scene_en, 600),
    scene_zh: str(source.scene_zh, 600),
    camera_en: str(source.camera_en, 500),
    camera_zh: str(source.camera_zh, 500),
    lighting_en: str(source.lighting_en, 500),
    lighting_zh: str(source.lighting_zh, 500),
    style_en: str(source.style_en, 500),
    style_zh: str(source.style_zh, 500),
    negative_en: str(source.negative_en, 900),
    negative_zh: str(source.negative_zh, 900),
    locks_en: locksEn,
    locks_zh: locksZh,
    face: normalizeFace(source.face),
    body: normalizeBody(source.body, warnings),
    proportions: normalizeProportions(source.proportions, warnings),
    camera: normalizeCamera(source.camera),
    anatomy: normalizeAnatomy(source.anatomy, warnings),
    technical: normalizeTechnical(source.technical),
    confidence: normalizeConfidence(source.confidence),
    drift_fixes_zh: drift,
    warnings_zh: [...strList(source.warnings_zh, 10, 300), ...warnings],
  }
  if (!analysis.identity_en) analysis.warnings_zh.push('模型没有给出英文身份描述，已尽量用面部细节补足。')
  if (!analysis.identity_zh) analysis.warnings_zh.push('模型没有给出中文身份描述。')
  if (!analysis.ethnicity_en && !analysis.ethnicity_zh) {
    analysis.warnings_zh.push('模型没有给出族裔/面部骨相，生成时容易漂成其他人种；建议重试或手动补充。')
  }
  if (!analysis.body.head_units) {
    analysis.warnings_zh.push('这张图看不到完整全身，头身比不可测：身高稳定请先在校正里填头身比，或换一张全身参考图。')
  }
  if (analysis.locks_zh.length === 0 && analysis.locks_en.length > 0) analysis.locks_zh = analysis.locks_en
  if (analysis.locks_en.length === 0 && analysis.locks_zh.length > 0) analysis.locks_en = analysis.locks_zh
  return analysis
}

function parseJsonLoose(text) {
  let value = text.trim()
  const fence = value.match(/```(?:json)?\s*([\s\S]*?)```/iu)
  if (fence) value = fence[1]
  const start = value.indexOf('{')
  if (start < 0) throw new Error('模型没有返回 JSON 对象')
  const end = value.lastIndexOf('}')
  const slice = end > start ? value.slice(start, end + 1) : value.slice(start)
  try {
    return JSON.parse(slice)
  } catch (first) {
    // 常见小问题：尾逗号、字符串里的裸换行、输出被截断。
    const withoutTrailingCommas = slice.replace(/,\s*([}\]])/gu, '$1')
    try {
      return JSON.parse(withoutTrailingCommas)
    } catch {
      // 继续尝试修复
    }
    let escaped = ''
    let inString = false
    let escape = false
    for (const char of withoutTrailingCommas) {
      if (inString) {
        if (escape) {
          escaped += char
          escape = false
        } else if (char === '\\') {
          escaped += char
          escape = true
        } else if (char === '"') {
          escaped += char
          inString = false
        } else if (char === '\n') {
          escaped += '\\n'
        } else if (char === '\r') {
          escaped += '\\r'
        } else if (char === '\t') {
          escaped += '\\t'
        } else {
          escaped += char
        }
      } else if (char === '"') {
        escaped += char
        inString = true
      } else {
        escaped += char
      }
    }

    const stack = []
    let inString2 = false
    let escape2 = false
    for (const char of escaped) {
      if (inString2) {
        if (escape2) escape2 = false
        else if (char === '\\') escape2 = true
        else if (char === '"') inString2 = false
        continue
      }
      if (char === '"') inString2 = true
      else if (char === '{') stack.push('}')
      else if (char === '[') stack.push(']')
      else if (char === '}' || char === ']') stack.pop()
    }
    let balanced = escaped
    if (inString2) balanced += '"'
    while (stack.length) balanced += stack.pop()
    try {
      return JSON.parse(balanced)
    } catch {
      throw first
    }
  }
}

// ---------------------------------------------------------------------------
// prompt compiler
// ---------------------------------------------------------------------------

function fmt(n) {
  if (n === null || n === undefined) return ''
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100)
}

function metricsEn(analysis, overrides) {
  const b = analysis.body
  const p = analysis.proportions
  const parts = []
  const height = overrides.height_cm !== undefined ? overrides.height_cm : b.height_cm
  const headUnits = overrides.head_units !== undefined ? overrides.head_units : b.head_units
  if (height) parts.push(`about ${Math.round(height)} cm tall (image-based estimate)`)
  if (headUnits) parts.push(`${fmt(headUnits)} heads tall from crown to floor`)
  if (b.shoulder_width_head_units) parts.push(`shoulder width ${fmt(b.shoulder_width_head_units)} head widths`)
  if (p.shoulder_hip_ratio) parts.push(`shoulder-to-hip ratio ${fmt(p.shoulder_hip_ratio)}`)
  if (p.waist_hip_ratio) parts.push(`waist-to-hip ratio ${fmt(p.waist_hip_ratio)}`)
  if (p.leg_body_ratio) parts.push(`leg-to-body ratio ${fmt(p.leg_body_ratio)}`)
  if (p.face_width_height_ratio) parts.push(`face width-to-height ratio ${fmt(p.face_width_height_ratio)}`)
  if (p.interpupillary_face_ratio) parts.push(`interpupillary distance ${fmt(p.interpupillary_face_ratio)} of face width`)
  if (p.nose_width_face_ratio) parts.push(`nose width ${fmt(p.nose_width_face_ratio)} of face width`)
  if (p.mouth_width_face_ratio) parts.push(`mouth width ${fmt(p.mouth_width_face_ratio)} of face width`)
  return parts.join('; ')
}

function metricsZh(analysis, overrides) {
  const b = analysis.body
  const p = analysis.proportions
  const parts = []
  const height = overrides.height_cm !== undefined ? overrides.height_cm : b.height_cm
  const headUnits = overrides.head_units !== undefined ? overrides.head_units : b.head_units
  if (height) parts.push(`身高约 ${Math.round(height)}cm（图像估算）`)
  if (headUnits) parts.push(`${fmt(headUnits)} 头身`)
  if (b.shoulder_width_head_units) parts.push(`肩宽 ${fmt(b.shoulder_width_head_units)} 头宽`)
  if (p.shoulder_hip_ratio) parts.push(`肩臀比 ${fmt(p.shoulder_hip_ratio)}`)
  if (p.waist_hip_ratio) parts.push(`腰臀比 ${fmt(p.waist_hip_ratio)}`)
  if (p.leg_body_ratio) parts.push(`腿身比 ${fmt(p.leg_body_ratio)}`)
  if (p.face_width_height_ratio) parts.push(`面宽/面高 ${fmt(p.face_width_height_ratio)}`)
  if (p.interpupillary_face_ratio) parts.push(`瞳距/面宽 ${fmt(p.interpupillary_face_ratio)}`)
  if (p.nose_width_face_ratio) parts.push(`鼻宽/面宽 ${fmt(p.nose_width_face_ratio)}`)
  if (p.mouth_width_face_ratio) parts.push(`嘴宽/面宽 ${fmt(p.mouth_width_face_ratio)}`)
  return parts.join('，')
}

function numericLocksEn(analysis, overrides) {
  const b = analysis.body
  const p = analysis.proportions
  const out = []
  const headUnits = overrides.head_units !== undefined ? overrides.head_units : b.head_units
  if (headUnits) out.push(`${fmt(headUnits)} heads tall`)
  if (p.face_width_height_ratio) out.push(`face width-to-height ${fmt(p.face_width_height_ratio)}`)
  if (p.interpupillary_face_ratio) out.push(`interpupillary/face-width ${fmt(p.interpupillary_face_ratio)}`)
  if (p.nose_width_face_ratio) out.push(`nose-width/face-width ${fmt(p.nose_width_face_ratio)}`)
  if (p.mouth_width_face_ratio) out.push(`mouth-width/face-width ${fmt(p.mouth_width_face_ratio)}`)
  if (b.shoulder_width_head_units) out.push(`shoulder width ${fmt(b.shoulder_width_head_units)} head widths`)
  if (p.waist_hip_ratio) out.push(`waist-to-hip ${fmt(p.waist_hip_ratio)}`)
  if (p.leg_body_ratio) out.push(`leg-to-body ${fmt(p.leg_body_ratio)}`)
  return out
}

function numericLocksZh(analysis, overrides) {
  const b = analysis.body
  const p = analysis.proportions
  const out = []
  const headUnits = overrides.head_units !== undefined ? overrides.head_units : b.head_units
  if (headUnits) out.push(`${fmt(headUnits)} 头身`)
  if (p.face_width_height_ratio) out.push(`面宽/面高 ${fmt(p.face_width_height_ratio)}`)
  if (p.interpupillary_face_ratio) out.push(`瞳距/面宽 ${fmt(p.interpupillary_face_ratio)}`)
  if (p.nose_width_face_ratio) out.push(`鼻宽/面宽 ${fmt(p.nose_width_face_ratio)}`)
  if (p.mouth_width_face_ratio) out.push(`嘴宽/面宽 ${fmt(p.mouth_width_face_ratio)}`)
  if (b.shoulder_width_head_units) out.push(`肩宽 ${fmt(b.shoulder_width_head_units)} 头宽`)
  if (p.waist_hip_ratio) out.push(`腰臀比 ${fmt(p.waist_hip_ratio)}`)
  if (p.leg_body_ratio) out.push(`腿身比 ${fmt(p.leg_body_ratio)}`)
  return out
}

function sizeFor(aspect) {
  const map = {
    '1:1': [1024, 1024],
    '3:4': [896, 1152],
    '4:3': [1152, 896],
    '9:16': [768, 1344],
    '16:9': [1344, 768],
    '2:3': [832, 1248],
    '3:2': [1248, 832],
  }
  if (map[aspect]) return map[aspect]
  const match = /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/u.exec(String(aspect || ''))
  if (!match) return map['1:1']
  const w = Number(match[1])
  const h = Number(match[2])
  if (!(w > 0 && h > 0)) return map['1:1']
  const longEdge = 1344
  const round8 = (value) => Math.max(256, Math.min(2048, Math.round(value / 8) * 8))
  return w >= h
    ? [longEdge, round8((longEdge * h) / w)]
    : [round8((longEdge * w) / h), longEdge]
}

function baseNegativeEn() {
  return 'different person, face swap, altered facial proportions, longer face, sharper chin, changed eye shape, different hairstyle, different age, longer legs, shorter legs, narrower shoulders, thicker waist, distorted hands, extra fingers, deformed, low resolution, watermark, text'
}

function baseNegativeZh() {
  return '不同的人，换脸，五官比例改变，脸型变长，下巴变尖，眼型改变，发型改变，年龄感改变，腿变长，腿变短，肩变窄，腰变粗，手指畸形，多余手指，画面畸形，低清晰度，水印，文字'
}

function driftFixes(analysis, overrides) {
  const p = analysis.proportions
  const b = analysis.body
  const list = []
  const ratio = p.face_width_height_ratio
  list.push({
    symptom: '脸变长 / 下巴变尖',
    fix: ratio
      ? `正向重申 face width-to-height ratio ${fmt(ratio)}，并固定面宽/面高 ${fmt(ratio)}；负向加入 long face, sharp chin, narrow jaw, elongated midface`
      : '负向加入 long face, sharp chin, narrow jaw, elongated midface；正向重申原图脸型，不要用“瓜子脸/长脸”这类会拉长脸型的词',
  })
  const headUnits = overrides.head_units !== undefined ? overrides.head_units : b.head_units
  const legRatio = p.leg_body_ratio
  list.push({
    symptom: '显矮 / 腿变短 / 头身比漂移',
    fix: headUnits || legRatio
      ? `正向重申${headUnits ? ` ${fmt(headUnits)} heads tall` : '原图头身比'}${legRatio ? `、leg-to-body ratio ${fmt(legRatio)}` : ''}；负向加入 short legs, long torso, stumpy proportions；机位保持在胸部高度，不要俯拍`
      : '这张图看不到完整全身，头身比无法量：先换一张全身参考图，或在校正里填真实头身比，再谈身高稳定；负向加入 short legs, long torso；机位保持胸部高度，不要俯拍',
  })
  const shoulderWidth = b.shoulder_width_head_units
  const shoulderHip = p.shoulder_hip_ratio
  list.push({
    symptom: '肩变窄 / 上半身显小',
    fix: `正向重申${shoulderWidth ? ` shoulder width ${fmt(shoulderWidth)} head widths` : '肩线与骨架'}${shoulderHip ? `、shoulder-to-hip ratio ${fmt(shoulderHip)}` : ''}；负向加入 narrow shoulders, sloping shoulders`,
  })
  const waistHip = p.waist_hip_ratio
  list.push({
    symptom: '腰胯变形 / 身材走样',
    fix: waistHip
      ? `正向重申 waist-to-hip ratio ${fmt(waistHip)}；负向加入 thick waist, wide hips, boxy torso`
      : '负向加入 thick waist, wide hips, boxy torso；正向重申原图腰线与胯部轮廓，不要用“沙漏身材/丰满”这类会改变体型的词',
  })
  list.push({
    symptom: '年龄感漂移',
    fix: `正向重申 apparent age ${analysis.age_range || '保持原图'}；负向加入 older, younger, mature face, baby face`,
  })
  list.push({
    symptom: '发型 / 发色漂移',
    fix: `正向重申 ${analysis.face.hair_en || '原图发型与发色'}；负向加入 different hairstyle, different hair color, changed hairline`,
  })
  if (analysis.ethnicity_en || analysis.ethnicity_zh) {
    list.push({
      symptom: '脸被欧化 / 像混血',
      fix: `正向重申 ${analysis.ethnicity_en || analysis.ethnicity_zh}、${analysis.face_structure_en || analysis.face_structure_zh}；负向加入 Caucasian, European, Western facial features, deep-set eyes, high nasal bridge, sharp jaw`,
    })
  }
  list.push({
    symptom: '皮肤塑料 / 2000 年代影楼感',
    fix: '正向加入 natural skin texture with visible pores, fine film grain, cinematic side light, shallow depth of field；负向加入 plastic skin, waxy skin, over-smoothed, beauty filter, HDR, flat studio lighting, 2000s studio portrait',
  })
  if (analysis.anatomy && analysis.anatomy.visible_nudity !== 'none') {
    list.push({
      symptom: '裸体 / 性器官细节被漏掉',
      fix: '把 anatomy_prompt_en/zh 原样加入正向提示词；负向不要写 clothes/covered/遮挡；如果模型仍回避，换更清晰的参考图或改用支持成人的本地模型',
    })
    if (!analysis.anatomy.hand_action_en && !analysis.anatomy.finger_action_en) {
      list.push({
        symptom: '手/手指动作没被识别',
        fix: '手动补充 hand_action（哪只手）、finger_action（哪几根手指、剥开/拉开/按住）、contact（接触与皮肤凹陷）、pose（仰卧/双腿张开/髋部角度），再编译；anatomy 字段支持这些键',
      })
    }
  }
  if (analysis.face.facial_hair_en || analysis.face.facial_hair_zh) {
    list.push({
      symptom: '胡须 / 胡型漂移',
      fix: `正向重申 ${analysis.face.facial_hair_en || analysis.face.facial_hair_zh}；负向加入 clean-shaven, different beard shape, missing moustache`,
    })
  }
  if (analysis.face.moles_en || analysis.face.moles_zh || analysis.face.scars_en || analysis.face.scars_zh) {
    list.push({
      symptom: '痣 / 疤 / 面部标记漂移',
      fix: `正向重申 ${[analysis.face.moles_en, analysis.face.scars_en, analysis.face.freckles_en, analysis.face.piercings_en].filter(Boolean).join('; ') || analysis.face.marks_en}；负向加入 extra moles, removed mole, added scar, extra piercings`,
    })
  }
  if (analysis.face.expression_en || analysis.face.expression_zh) {
    list.push({
      symptom: '表情漂移',
      fix: `表情是可变项：要锁定就加入 expression hint「${analysis.face.expression_zh || analysis.face.expression_en}」；不要把它写进身份锚点`,
    })
  }
  const custom = analysis.drift_fixes_zh.map((item) => ({ symptom: item.symptom, fix: item.fix }))
  return [...custom, ...list]
}

function compilePrompts(analysis, overrides) {
  const b = analysis.body
  const p = analysis.proportions
  const headUnits = overrides.head_units !== undefined ? overrides.head_units : b.head_units
  const age = overrides.age_range || analysis.age_range
  const genderEn = overrides.gender && overrides.gender !== 'unknown' ? overrides.gender : analysis.gender
  const genderZh = overrides.gender === 'female' ? '女性' : overrides.gender === 'male' ? '男性' : overrides.gender === 'androgynous' ? '中性' : analysis.gender_zh
  const mEn = metricsEn(analysis, overrides)
  const mZh = metricsZh(analysis, overrides)
  const locksEn = unique([...numericLocksEn(analysis, overrides), ...analysis.locks_en]).slice(0, 10)
  const locksZh = unique([...numericLocksZh(analysis, overrides), ...analysis.locks_zh]).slice(0, 10)
  const wardrobeEn = analysis.wardrobe_en ? `wearing ${analysis.wardrobe_en}` : ''
  const wardrobeZh = analysis.wardrobe_zh ? `穿着${analysis.wardrobe_zh}` : ''
  const identityEn = analysis.identity_en || analysis.summary_zh || `${genderEn} in the reference, apparent age ${age}, ${analysis.face.face_shape_en}, ${analysis.face.eyes_en}, ${analysis.face.hair_en}`.trim()
  const identityZh = analysis.identity_zh || analysis.summary_zh || `${genderZh}，${age}岁左右，${analysis.face.face_shape_zh}，${analysis.face.eyes_zh}，${analysis.face.hair_zh}`.trim()
  const face = analysis.face
  const faceDetailsEn = joinClauses([
    face.facial_hair_en,
    face.moles_en,
    face.scars_en,
    face.freckles_en,
    face.birthmarks_en,
    face.piercings_en,
    face.tattoos_en,
    face.makeup_en,
    face.teeth_en,
    face.gaze_en,
    face.skin_details_en,
  ], '; ')
  const faceDetailsZh = joinClauses([
    face.facial_hair_zh,
    face.moles_zh,
    face.scars_zh,
    face.freckles_zh,
    face.birthmarks_zh,
    face.piercings_zh,
    face.tattoos_zh,
    face.makeup_zh,
    face.teeth_zh,
    face.gaze_zh,
    face.skin_details_zh,
  ], '；')
  const expressionHintEn = face.expression_en
  const expressionHintZh = face.expression_zh
  const hasFacialHair = /beard|moustache|mustache|stubble|goatee|sideburn|胡须|胡子|络腮|唇须|小胡子/iu.test(`${face.facial_hair_en} ${face.facial_hair_zh}`)
  const headPhraseEn = headUnits ? `${fmt(headUnits)} heads tall` : 'the reference head-to-body ratio (not measurable from this crop; follow the reference)'
  const headPhraseZh = headUnits ? `${fmt(headUnits)} 头身` : '原图头身比（这张图不可测，按参考图为准）'
  const ratioZh = (label, ratio) => ratio ? `${label} ${fmt(ratio)}` : `${label}按参考图`
  const ratioEn = (label, ratio) => ratio ? `${label} ${fmt(ratio)}` : `${label} as in the reference`
  const tech = analysis.technical || {}
  const anatomy = analysis.anatomy || {}
  const ethnicityEn = analysis.ethnicity_en
  const ethnicityZh = analysis.ethnicity_zh
  const faceStructureEn = analysis.face_structure_en
  const faceStructureZh = analysis.face_structure_zh
  const ethnicityLockEn = joinClauses([
    ethnicityEn ? `ethnicity lock: ${ethnicityEn}` : '',
    faceStructureEn ? `facial bone structure: ${faceStructureEn}` : '',
    ethnicityEn ? 'do not change ethnicity or facial bone structure' : '',
  ])
  const ethnicityLockZh = joinClauses([
    ethnicityZh ? `族裔锁定：${ethnicityZh}` : '',
    faceStructureZh ? `面部骨相：${faceStructureZh}` : '',
    ethnicityZh ? '不要改变族裔与面部骨相' : '',
  ], '；')
  const isCloseup = ['genital_closeup', 'detail_macro'].includes(analysis.subject_scope)
  const anatomyPartsEn = [
    anatomy.pose_en,
    anatomy.genitals_en,
    anatomy.pubic_hair_en,
    anatomy.buttocks_en,
    anatomy.hand_action_en,
    anatomy.finger_action_en,
    anatomy.contact_en,
    anatomy.details_en,
    anatomy.chest_en,
  ]
  const anatomyPartsZh = [
    anatomy.pose_zh,
    anatomy.genitals_zh,
    anatomy.pubic_hair_zh,
    anatomy.buttocks_zh,
    anatomy.hand_action_zh,
    anatomy.finger_action_zh,
    anatomy.contact_zh,
    anatomy.details_zh,
    anatomy.chest_zh,
  ]
  const anatomyPromptEn = anatomy.visible_nudity && anatomy.visible_nudity !== 'none'
    ? joinClauses(anatomyPartsEn, '; ')
    : ''
  const anatomyPromptZh = anatomy.visible_nudity && anatomy.visible_nudity !== 'none'
    ? joinClauses(anatomyPartsZh, '；')
    : ''
  const manualAnatomy = str((overrides && overrides.anatomy_note) || '', 1200)
  const anatomyPromptEnFinal = anatomyPromptEn + (manualAnatomy ? `; manual note: ${manualAnatomy}` : '')
  const anatomyPromptZhFinal = anatomyPromptZh + (manualAnatomy ? `；手动补充：${manualAnatomy}` : '')
  const closeupNegativeEn = isCloseup
    ? 'full body, face, extra limbs, duplicated anatomy, changed labia size, changed labia shape, changed asymmetry, added pubic hair, removed pubic hair, added tattoos, censorship, mosaic, blur, plastic skin'
    : ''
  const closeupNegativeZh = isCloseup
    ? '全身，脸，多余肢体，重复器官，改变阴唇大小，改变阴唇形状，改变不对称，添加阴毛，去除阴毛，添加纹身，马赛克，审查遮挡，模糊，塑料皮肤'
    : ''
  const qualityEn = tech.quality_en || joinClauses([
    tech.medium_en,
    tech.camera_en,
    tech.lens_en,
    tech.aperture,
    tech.skin_texture_en,
    tech.grain_en,
    tech.color_grade_en,
    tech.depth_of_field_en,
    tech.post_process_en,
  ], ', ')
  const qualityZh = tech.quality_zh || joinClauses([
    tech.medium_zh,
    tech.camera_zh,
    tech.lens_zh,
    tech.aperture,
    tech.skin_texture_zh,
    tech.grain_zh,
    tech.color_grade_zh,
    tech.depth_of_field_zh,
    tech.post_process_zh,
  ], '，')
  const qualityLockEn = joinClauses([
    qualityEn,
    'natural skin texture with visible pores, fine film grain, realistic micro-contrast, no plastic smoothing',
  ], ', ')
  const qualityLockZh = joinClauses([
    qualityZh,
    '自然皮肤纹理与可见毛孔，细腻胶片颗粒，真实微对比，不要塑料磨皮',
  ], '，')
  const asianSubject = /east asian|asian|chinese|japanese|korean|han chinese|东亚|汉族|亚洲|华人|日本人|韩国人/iu.test(`${ethnicityEn} ${ethnicityZh} ${identityEn} ${identityZh}`)
  const ethnicityNegativeEn = asianSubject
    ? 'Caucasian, European, Western facial features, deep-set eyes, high nasal bridge, sharp jaw, non-Asian face, mixed-race drift'
    : ''
  const ethnicityNegativeZh = asianSubject
    ? '欧化，白人脸，混血感，深眼窝，高鼻梁，硬下颌，非亚洲脸'
    : ''
  const qualityNegativeEn = 'plastic skin, waxy skin, over-smoothed, beauty filter, HDR, 2000s studio portrait, flat studio lighting'
  const qualityNegativeZh = '塑料皮肤，蜡感皮肤，过度磨皮，美颜滤镜，HDR，2000年代影楼照，平光棚拍'
  const facialHairNegativeEn = !hasFacialHair && !isCloseup ? 'beard, moustache, stubble, goatee, facial hair' : ''
  const facialHairNegativeZh = !hasFacialHair && !isCloseup ? '胡须，胡子，络腮胡，唇须，胡茬' : ''

  const fullEn = isCloseup
    ? joinClauses([anatomyPromptEnFinal, analysis.camera_en, analysis.lighting_en, qualityLockEn])
    : joinClauses([
      identityEn,
      ethnicityLockEn,
      faceDetailsEn,
      analysis.body_en,
      anatomyPromptEnFinal,
      mEn,
      wardrobeEn,
      analysis.scene_en,
      analysis.camera_en,
      analysis.lighting_en,
      analysis.style_en,
      qualityLockEn,
      locksEn.length ? `identity anchors that must remain unchanged: ${locksEn.join('; ')}` : '',
    ])

  const fullZh = isCloseup
    ? joinClauses([anatomyPromptZhFinal, analysis.camera_zh, analysis.lighting_zh, qualityLockZh], '；')
    : joinClauses([
      identityZh,
      ethnicityLockZh,
      faceDetailsZh,
      analysis.body_zh,
      anatomyPromptZhFinal,
      mZh,
      wardrobeZh,
      analysis.scene_zh,
      analysis.camera_zh,
      analysis.lighting_zh,
      analysis.style_zh,
      qualityLockZh,
      locksZh.length ? `以下身份锚点必须保持不变：${locksZh.join('；')}` : '',
    ], '；')

  const negativeEn = unique([
    analysis.negative_en,
    baseNegativeEn(),
    ethnicityNegativeEn,
    qualityNegativeEn,
    closeupNegativeEn,
    facialHairNegativeEn,
  ].join(', ').split(',').map((item) => item.trim()).filter(Boolean)).join(', ')

  const negativeZh = unique([
    analysis.negative_zh,
    baseNegativeZh(),
    ethnicityNegativeZh,
    qualityNegativeZh,
    closeupNegativeZh,
    facialHairNegativeZh,
  ].join('，').split(/[，,]/u).map((item) => item.trim()).filter(Boolean)).join('，')

  const referenceEditZh = isCloseup
    ? `${joinClauses([
      '以 <image1> 为局部参考',
      anatomyPromptZhFinal ? `只保留参考图里可见的局部、手/手指动作、接触、姿势、机位、光线和皮肤质感：${anatomyPromptZhFinal}` : '只保留参考图里可见的局部、机位、光线和皮肤质感',
      `保持原图质感：${qualityLockZh}`,
      '不要补脸、不要补全身、不要添加多余肢体或重复器官，不要改变阴唇大小/形状/不对称，不要添加或去除阴毛，不要加马赛克或模糊',
    ], '；')}。`
    : `${joinClauses([
      '以 <image1> 作为唯一身份与身材参考',
      ethnicityLockZh ? `保持${ethnicityLockZh}` : '',
      faceDetailsZh ? `保持面部细节：${faceDetailsZh}` : '',
      `保持脸型（${ratioZh('面宽/面高', p.face_width_height_ratio)}）、${ratioZh('瞳距/面宽', p.interpupillary_face_ratio)}、${ratioZh('鼻宽/面宽', p.nose_width_face_ratio)}、${ratioZh('嘴宽/面宽', p.mouth_width_face_ratio)}、${headPhraseZh}、${ratioZh('肩宽/头宽', b.shoulder_width_head_units)}、${ratioZh('腰臀比', p.waist_hip_ratio)}、发型、肤色和年龄感完全一致`,
      anatomyPromptZhFinal ? `身体可见细节按参考图：${anatomyPromptZhFinal}` : '',
      `只修改：${analysis.scene_zh || '场景、服装与姿态'}`,
      `保持原图的皮肤纹理、胶片颗粒、光线方向和整体质感：${qualityLockZh}`,
      '不要改变五官比例、脸型、族裔、身高比例、体型和发际线；不要换脸、欧化或美颜',
    ], '；')}。`

  const referenceEditEn = isCloseup
    ? `${joinClauses([
      'Use <image1> as the local reference',
      anatomyPromptEnFinal ? `Keep only the visible local anatomy, hand/finger action, contact, pose, camera angle, light and skin texture from the reference: ${anatomyPromptEnFinal}` : 'Keep only the visible local anatomy, camera angle, light and skin texture from the reference',
      `Keep the reference quality: ${qualityLockEn}`,
      'Do not add a face, a full body, extra limbs or duplicated anatomy; do not change labia size, shape or asymmetry; do not add or remove pubic hair; no censorship or blur',
    ], '. ')}.`
    : `${joinClauses([
      'Use <image1> as the only identity and body reference',
      ethnicityLockEn ? `Keep the ${ethnicityLockEn}` : '',
      faceDetailsEn ? `Keep facial details: ${faceDetailsEn}` : '',
      `Keep the ${ratioEn('face width-to-height ratio', p.face_width_height_ratio)}, ${ratioEn('interpupillary distance / face width', p.interpupillary_face_ratio)}, ${ratioEn('nose width / face width', p.nose_width_face_ratio)}, ${ratioEn('mouth width / face width', p.mouth_width_face_ratio)}, ${headPhraseEn}, ${ratioEn('shoulder width / head width', b.shoulder_width_head_units)}, ${ratioEn('waist-to-hip ratio', p.waist_hip_ratio)}, hairstyle, skin tone and apparent age exactly unchanged`,
      anatomyPromptEnFinal ? `Visible body detail follows the reference: ${anatomyPromptEnFinal}` : '',
      `Change only: ${analysis.scene_en || 'scene, wardrobe and pose'}`,
      `Keep the reference's skin texture, film grain, light direction and overall quality: ${qualityLockEn}`,
      'Do not alter facial proportions, face shape, ethnicity, height ratio, body build or hairline; no face swap, no Europeanization, no beautification',
    ], '. ')}.`

  const referenceEditGenericZh = referenceEditZh
    .replaceAll('<image1>', '参考图中的人物')
    .replace(/image1/gu, '参考图')
  const referenceEditGenericEn = referenceEditEn
    .replaceAll('<image1>', 'the person in the reference image')
    .replace(/image1/gu, 'the reference image')

  const identitySheetZh = isCloseup
    ? ''
    : `${joinClauses([
      '同一人物的角色三视图设定：正面、侧面、背面全身站姿，纯白背景，均匀柔光，无遮挡',
      identityZh,
      ethnicityLockZh,
      faceDetailsZh,
      analysis.body_zh,
      mZh,
      qualityLockZh,
      '三视图中的脸型、五官比例、族裔、发型和身高比例必须完全一致，便于作为后续生成的固定身份参考',
    ], '；')}。`

  const compactZh = isCloseup
    ? trimTrailing(joinClauses([anatomyPromptZhFinal, qualityLockZh], '；'), 420)
    : trimTrailing(joinClauses([
      identityZh,
      ethnicityLockZh,
      analysis.body_zh,
      headUnits ? `${fmt(headUnits)}头身` : '',
      analysis.wardrobe_zh,
      analysis.scene_zh,
      qualityLockZh,
    ], '；'), 420)

  // 手机版：一段可直接粘贴到豆包/即梦/文生图的中文，不带 <image1>、不带负向词；内容按用户参考图原样保留。
  const mobileQualityZh = tech.quality_zh || '真实照片质感，自然皮肤纹理，柔和侧光，浅景深'
  const mobileQualityEn = tech.quality_en || 'photorealistic, natural skin texture, soft side light, shallow depth of field'
  const mobileBodyZh = isCloseup
    ? trimTrailing(joinClauses([anatomyPromptZhFinal, analysis.camera_zh], '；'), 300)
    : trimTrailing(joinClauses([
      trimTrailing(identityZh, 150),
      trimTrailing(faceDetailsZh, 80),
      trimTrailing(analysis.body_zh, 70),
      analysis.wardrobe_zh ? `穿${trimTrailing(analysis.wardrobe_zh, 80)}` : '',
      trimTrailing(analysis.scene_zh, 60),
    ], '；'), 300)
  const mobileBodyEn = isCloseup
    ? trimTrailing(joinClauses([anatomyPromptEnFinal, analysis.camera_en], '; '), 360)
    : trimTrailing(joinClauses([
      trimTrailing(identityEn, 180),
      trimTrailing(faceDetailsEn, 100),
      trimTrailing(analysis.body_en, 90),
      analysis.wardrobe_en ? `wearing ${trimTrailing(analysis.wardrobe_en, 90)}` : '',
      trimTrailing(analysis.scene_en, 70),
    ], '; '), 360)
  const mobileZh = trimTrailing(joinClauses([mobileBodyZh, mobileQualityZh], '；'), 420)
  const mobileEn = trimTrailing(joinClauses([mobileBodyEn, mobileQualityEn], '; '), 500)
  const mobileNoteZh = isCloseup
    ? '手机版只保留参考图可见的局部、手/手指动作、机位和质感；不带 <image1>、不带负向词。'
    : '手机版不带 <image1>、不带负向词；衣服/场景可以直接改，再整段复制。文生图锁不住真实身份，要锁脸请用参考图编辑。'

  const combinedZh = [
    '【正向提示词】',
    fullZh,
    '',
    '【负向提示词】',
    negativeZh,
    '',
    '【身份锁定】',
    locksZh.join('；'),
    '',
    '【质感锁定】',
    qualityLockZh,
  ].join('\n')

  const combinedEn = [
    '[positive]',
    fullEn,
    '',
    '[negative]',
    negativeEn,
    '',
    '[identity locks]',
    locksEn.join('; '),
    '',
    '[quality lock]',
    qualityLockEn,
  ].join('\n')

  const [width, heightPx] = sizeFor(analysis.camera.aspect_ratio)
  const params = {
    width,
    height: heightPx,
    steps: 40,
    guidance: negativeZh ? 2.5 : 1,
    scheduler: 'linear',
    seed: null,
    aspect_ratio: analysis.camera.aspect_ratio,
    note_zh: '先固定尺寸与 seed 做对照；负向词非空时 guidance 用 2.5。',
  }

  return {
    params,
    identity_en: identityEn,
    identity_zh: identityZh,
    face_details_en: faceDetailsEn,
    face_details_zh: faceDetailsZh,
    expression_hint_en: expressionHintEn,
    expression_hint_zh: expressionHintZh,
    ethnicity_lock_en: ethnicityLockEn,
    ethnicity_lock_zh: ethnicityLockZh,
    quality_lock_en: qualityLockEn,
    quality_lock_zh: qualityLockZh,
    anatomy_prompt_en: anatomyPromptEnFinal,
    anatomy_prompt_zh: anatomyPromptZhFinal,
    full_en: fullEn,
    full_zh: fullZh,
    negative_en: negativeEn,
    negative_zh: negativeZh,
    compact_en: trimTrailing(fullEn, 320),
    compact_zh: compactZh,
    mobile_en: mobileEn,
    mobile_zh: mobileZh,
    mobile_note_zh: mobileNoteZh,
    reference_edit_en: referenceEditEn,
    reference_edit_zh: referenceEditZh,
    reference_edit_generic_en: referenceEditGenericEn,
    reference_edit_generic_zh: referenceEditGenericZh,
    subject_scope: analysis.subject_scope,
    identity_sheet_zh: identitySheetZh,
    combined_en: combinedEn,
    combined_zh: combinedZh,
    locks_en: locksEn,
    locks_zh: locksZh,
    drift_fixes: driftFixes(analysis, overrides),
    rules_zh: [
      '固定模型、分辨率与 seed：三者不变，结果才有可比性；先定稿再扩图。',
      '先用身份提示词出一张半身定妆照，确认脸型、瞳距、鼻宽、嘴宽与头身比，再换场景。',
      '每次只改一个变量：先服装，再场景，最后机位；不要同时改焦段和构图。',
      '机位固定在胸部高度，焦段 50–85mm；广角近摄会拉长脸和腿，直接破坏身高比例。',
      '有参考图时优先用参考图编辑或多图参考（<image1> 为身份图），提示词只写变化部分。',
      '换装、换场景前，先删掉「身份锚点」里属于服装、道具、机位的词，只保留脸型、五官比例、发型、肤色、疤痣和身材比例。',
      '脸被欧化时，正向重申族裔与面部骨相（面中部平缓、低鼻梁、内眦赘皮、下颌角柔和），负向加 Caucasian/European/deep-set eyes/high nasal bridge。',
      '皮肤塑料或像 2000 年代影楼照时，正向加 natural skin texture/pores/fine grain/cinematic side light，负向加 plastic skin/over-smoothed/HDR/flat studio light。',
      '生成后按「偏差自检」逐项对照；漂移时只加对应修正词，不要整段重写提示词。',
    ],
  }
}

function recordTitle(analysis, fallback) {
  return str(analysis && analysis.title, 40) || fallback || '未命名反推'
}

function toSummary(record) {
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    title: record.title,
    status: record.status,
    error: record.error || '',
    provider: record.provider || '',
    model: record.model || '',
    effort: record.effort || '',
    image: record.image ? {
      mediaType: record.image.mediaType,
      width: record.image.width,
      height: record.image.height,
      bytes: record.image.bytes,
      name: record.image.name || '',
    } : null,
  }
}

function toPublic(record) {
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    title: record.title,
    status: record.status,
    error: record.error || '',
    provider: record.provider || '',
    model: record.model || '',
    effort: record.effort || '',
    image: record.image ? {
      mediaType: record.image.mediaType,
      width: record.image.width,
      height: record.image.height,
      bytes: record.image.bytes,
      name: record.image.name || '',
    } : null,
    analysis: record.analysis || null,
    prompts: record.prompts || null,
    params: record.params || null,
    overrides: record.overrides || {},
    warnings_zh: record.analysis ? record.analysis.warnings_zh : [],
  }
}

function applyOverrides(analysis, overrides) {
  const next = structuredClone(analysis)
  if (overrides.height_cm !== undefined) {
    next.body.height_cm = overrides.height_cm === null ? null : int(overrides.height_cm, 120, 220)
  }
  if (overrides.head_units !== undefined) {
    next.body.head_units = overrides.head_units === null ? null : num(overrides.head_units, 5.5, 9.5)
  }
  if (overrides.age_range !== undefined) next.age_range = str(overrides.age_range, 20)
  if (overrides.gender !== undefined && ['female', 'male', 'androgynous', 'unknown'].includes(overrides.gender)) {
    next.gender = overrides.gender
    next.gender_zh = overrides.gender === 'female' ? '女性' : overrides.gender === 'male' ? '男性' : overrides.gender === 'androgynous' ? '中性' : '人物'
  }
  return next
}

// ---------------------------------------------------------------------------
// plugin
// ---------------------------------------------------------------------------

export function apply(ctx, config = {}) {
  const store = createStore(dataDir(config))
  const running = new Map()
  const controllers = new Map()
  const defaults = {
    provider: typeof config.provider === 'string' ? config.provider : '',
    model: typeof config.model === 'string' ? config.model : '',
    effort: typeof config.effort === 'string' && config.effort ? config.effort : 'low',
    maxTokens: Number.isFinite(config.maxTokens) ? config.maxTokens : 8000,
    timeoutMs: Number.isFinite(config.timeoutMs) ? config.timeoutMs : 240000,
  }

  // 上一次成功使用的视觉路由，供客户端显示。
  let lastRoute = null

  function publicState(selectedId) {
    const latest = store.list().find((record) => record.provider && record.model)
    const selected = (selectedId && store.find(selectedId)) || store.list()[0] || null
    return {
      records: store.list().slice(0, 80).map(toSummary),
      selected: selected ? toPublic(selected) : null,
      vision: lastRoute || (latest
        ? { provider: latest.provider, model: latest.model, effort: latest.effort || '' }
        : null),
      total: store.list().length,
    }
  }

  async function persist(record) {
    record.updatedAt = nowIso()
    await store.save()
  }

  function resolveCurrentSelection() {
    try {
      const service = ctx.get('agentDefaultModel')
      if (!service) return null
      const selection = service.currentSelection()
      if (selection && selection.provider && selection.model) return selection
    } catch (error) {
      console.error('[prompt-reverse] 读取默认模型失败：', error)
    }
    return null
  }

  function providerScore(id) {
    if (id === 'deepseek-account') return 0
    if (id === 'deepseek') return 1
    if (id.startsWith('deepseek')) return 2
    // Claude Code routes need a live owning DSH agent; a Host-side HTTP analysis has none.
    if (id.startsWith('claude')) return 90
    return 10
  }

  async function resolveVisionRoute() {
    const candidates = []
    if (defaults.provider && defaults.model) candidates.push({ provider: defaults.provider, model: defaults.model, explicit: true })
    const selection = resolveCurrentSelection()
    if (selection && !selection.provider.startsWith('claude')) candidates.push({ provider: selection.provider, model: selection.model })

    const tried = new Set()
    for (const candidate of candidates) {
      const key = `${candidate.provider}/${candidate.model}`
      if (tried.has(key)) continue
      tried.add(key)
      try {
        const info = await ctx.llm.resolveModelInfo(candidate.provider, candidate.model)
        if (info.inputModalities && info.inputModalities.includes('image')) {
          return { provider: candidate.provider, model: candidate.model, info }
        }
      } catch (error) {
        console.warn(`[prompt-reverse] 模型 ${key} 不可用：`, error && error.message)
      }
    }

    const providers = [...ctx.llm.listProviders()].sort((a, b) => providerScore(a.id) - providerScore(b.id))
    for (const provider of providers) {
      if (provider.id.startsWith('claude')) continue
      try {
        const models = await ctx.llm.listModels(provider.id)
        for (const model of models) {
          if (!model.inputModalities || !model.inputModalities.includes('image')) continue
          const key = `${provider.id}/${model.id}`
          if (tried.has(key)) continue
          tried.add(key)
          try {
            const info = await ctx.llm.resolveModelInfo(provider.id, model.id)
            return { provider: provider.id, model: model.id, info }
          } catch {
            // 继续找下一个
          }
        }
      } catch (error) {
        console.warn(`[prompt-reverse] 枚举 ${provider.id} 模型失败：`, error && error.message)
      }
    }
    throw new Error('没有可用于 Host 侧分析的视觉模型：请把默认模型切到 DeepSeek 视觉模型（例如 deepseek-flash），或在插件 config 里指定 provider/model。Claude Code 的 claude/* 路由需要会话内的 Agent，不能从浏览器上传后台调用。')
  }

  function pickEffort(info) {
    const reasoning = info && info.reasoning
    const efforts = reasoning && Array.isArray(reasoning.efforts) ? reasoning.efforts : []
    if (!efforts.length) return undefined
    const ids = efforts.map((item) => item.id)
    if (defaults.effort && ids.includes(defaults.effort)) return defaults.effort
    if (reasoning.defaultEffort && ids.includes(reasoning.defaultEffort)) return reasoning.defaultEffort
    return ids[0]
  }

  async function analyzeRecord(record) {
    const route = await resolveVisionRoute()
    lastRoute = { provider: route.provider, model: route.model, effort: pickEffort(route.info) || '' }

    const controller = new AbortController()
    controllers.set(record.id, controller)
    const timeout = setTimeout(() => controller.abort(new Error('分析超时，请重试或换一个更快的视觉模型')), defaults.timeoutMs)
    try {
      const call = await ctx.llm.prepareCall(
        { provider: route.provider, model: route.model, maxTokens: defaults.maxTokens },
        controller.signal,
        (controls) => {
          const effort = pickEffort(route.info)
          return effort ? { ...controls, reasoningEffort: effort } : controls
        },
      )

      const message = {
        id: randomUUID(),
        role: 'user',
        content: [
          { type: 'text', text: USER_PROMPT },
          { type: 'image', attachment: record.image },
        ],
        source: { kind: 'user' },
      }

      let text = ''
      let blocksText = ''
      let finish = null
      for await (const chunk of call.stream({
        ...call.config,
        messages: [message],
        system: SYSTEM_PROMPT,
        signal: controller.signal,
      })) {
        if (chunk.type === 'text-delta') text += chunk.text
        else if (chunk.type === 'block-end' && chunk.block && chunk.block.type === 'text') blocksText += chunk.block.text
        else if (chunk.type === 'finish') finish = chunk.reason
      }

      if (!finish) finish = { kind: 'stop' }
      if (finish.kind === 'error') throw new Error(finish.failure?.message || '视觉模型调用失败')
      if (finish.kind === 'aborted') throw new Error(finish.failure?.message || '分析被中止')
      if (finish.kind === 'tool-calls') throw new Error('模型返回了工具调用而不是 JSON，请重试')

      const output = (text || blocksText).trim()
      if (!output) throw new Error('视觉模型没有返回内容')
      record.raw = output.slice(0, 120000)

      let parsed
      try {
        parsed = parseJsonLoose(output)
      } catch (error) {
        if (finish.kind === 'max-tokens') {
          throw new Error('视觉模型输出被 maxTokens 截断，JSON 不完整：请提高插件 config.maxTokens，或在设置里换一个输出上限更大的视觉模型。原始输出已保留。')
        }
        throw new Error(`视觉模型返回的 JSON 无法解析：${error.message}。原始输出已保留，可在面板「查看原始 JSON」里检查后重试。`)
      }
      const analysis = normalizeAnalysis(parsed)
      const effective = applyOverrides(analysis, record.overrides)
      const { params, ...promptBlocks } = compilePrompts(effective, record.overrides)
      record.analysis = analysis
      if (!record.titleLocked) record.title = recordTitle(analysis, record.title)
      record.prompts = promptBlocks
      record.params = params
      record.provider = route.provider
      record.model = route.model
      record.effort = lastRoute.effort
      record.raw = output.slice(0, 120000)
      record.status = 'ready'
      record.error = ''
    } finally {
      clearTimeout(timeout)
      controllers.delete(record.id)
    }
  }

  async function startAnalysis(id) {
    const record = store.find(id)
    if (!record) throw new Error('记录不存在')
    if (running.has(id)) return
    record.status = 'analyzing'
    record.error = ''
    await persist(record)

    const task = (async () => {
      try {
        await analyzeRecord(record)
      } catch (error) {
        record.status = 'error'
        record.error = error && error.message ? error.message : String(error)
      } finally {
        record.updatedAt = nowIso()
        await store.save()
        running.delete(id)
      }
    })()
    running.set(id, task)
  }

  function waitFor(id) {
    return running.get(id) || Promise.resolve()
  }

  async function createRecord({ buffer, mediaType, name, attachment, title, thumb }) {
    if (!MEDIA_TYPES.has(mediaType)) throw new Error('只支持 PNG / JPEG / WebP / GIF')
    let ref = attachment
    if (!ref) {
      if (!buffer || buffer.length === 0) throw new Error('图片为空')
      if (buffer.length > MAX_UPLOAD_BYTES) throw new Error('图片超过 40MB')
      ref = await ctx.attachments.saveImage({ data: buffer, mediaType, name: name || undefined })
    } else {
      // 校验附件真实存在且可读，避免写入坏引用。
      await ctx.attachments.readImage(ref)
    }
    const id = randomUUID()
    const record = {
      id,
      version: RECORD_VERSION,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      title: str(title, 60) || (name ? name.replace(/\.[^.]+$/u, '').slice(0, 40) : '') || '未命名反推',
      titleLocked: Boolean(str(title, 60)),
      status: 'new',
      error: '',
      provider: '',
      model: '',
      effort: '',
      image: ref,
      analysis: null,
      prompts: null,
      params: null,
      overrides: {},
      raw: '',
    }
    await store.add(record)
    if (thumb && thumb.length) await store.saveThumb(id, thumb)
    return record
  }

  // -------------------------------------------------------------------------
  // HTTP routes
  // -------------------------------------------------------------------------

  const routes = [
    ['state', async (req, res) => {
      if (req.method !== 'GET') throw new Error('只支持 GET')
      const url = new URL(req.url || '/', 'http://localhost')
      return json(res, 200, publicState(url.searchParams.get('selected') || ''))
    }],
    ['record', async (req, res) => {
      if (req.method !== 'GET') throw new Error('只支持 GET')
      const url = new URL(req.url || '/', 'http://localhost')
      const record = store.find(url.searchParams.get('id') || '')
      if (!record) return json(res, 404, { error: '记录不存在' })
      const includeRaw = /^(1|true)$/u.test(url.searchParams.get('include_raw') || '')
      return json(res, 200, { ...toPublic(record), ...(includeRaw ? { raw: record.raw || '' } : {}) })
    }],
    ['upload', async (req, res) => {
      if (req.method !== 'POST') throw new Error('只支持 POST')
      const body = await readRequestBody(req)
      const data = typeof body.data === 'string' ? body.data : ''
      if (!data) throw new Error('缺少图片数据')
      const mediaType = str(body.mediaType, 40)
      const buffer = Buffer.from(data.replace(/^data:[^;]+;base64,/u, ''), 'base64')
      const thumbData = typeof body.thumb === 'string' ? body.thumb : ''
      const thumb = thumbData ? Buffer.from(thumbData.replace(/^data:[^;]+;base64,/u, ''), 'base64') : null
      if (thumb && thumb.length > 512 * 1024) throw new Error('缩略图超过 512KB')
      const record = await createRecord({ buffer, mediaType, name: str(body.name, 120), title: str(body.title, 60), thumb })
      await startAnalysis(record.id)
      return json(res, 200, { record: toPublic(record) })
    }],
    ['analyze', async (req, res) => {
      if (req.method !== 'POST') throw new Error('只支持 POST')
      const body = await readRequestBody(req)
      const id = str(body.id, 60)
      const record = store.find(id)
      if (!record) return json(res, 404, { error: '记录不存在' })
      if (record.status === 'analyzing') return json(res, 200, { accepted: true, already: true })
      await startAnalysis(id)
      return json(res, 200, { accepted: true })
    }],
    ['update', async (req, res) => {
      if (req.method !== 'POST') throw new Error('只支持 POST')
      const body = await readRequestBody(req)
      const record = store.find(str(body.id, 60))
      if (!record) return json(res, 404, { error: '记录不存在' })
      if (!record.analysis) throw new Error('还没有可校正的分析结果')
      const overrides = body.overrides && typeof body.overrides === 'object' ? body.overrides : {}
      record.overrides = {
        ...record.overrides,
        ...(overrides.height_cm !== undefined ? { height_cm: overrides.height_cm === null ? null : int(overrides.height_cm, 120, 220) } : {}),
        ...(overrides.head_units !== undefined ? { head_units: overrides.head_units === null ? null : num(overrides.head_units, 5.5, 9.5) } : {}),
        ...(overrides.age_range !== undefined ? { age_range: str(overrides.age_range, 20) } : {}),
        ...(overrides.gender !== undefined && ['female', 'male', 'androgynous', 'unknown'].includes(overrides.gender) ? { gender: overrides.gender } : {}),
        ...(overrides.anatomy_note !== undefined ? { anatomy_note: str(overrides.anatomy_note, 1200) } : {}),
      }
      if (body.title !== undefined) {
        record.title = str(body.title, 60) || record.title
        record.titleLocked = true
      }
      const effective = applyOverrides(record.analysis, record.overrides)
      const { params, ...promptBlocks } = compilePrompts(effective, record.overrides)
      record.prompts = promptBlocks
      record.params = params
      await persist(record)
      return json(res, 200, { record: toPublic(record) })
    }],
    ['delete', async (req, res) => {
      if (req.method !== 'POST') throw new Error('只支持 POST')
      const body = await readRequestBody(req)
      if (body.confirm !== true) throw new Error('删除需要 confirm: true')
      const id = str(body.id, 60)
      if (!store.find(id)) return json(res, 404, { error: '记录不存在' })
      if (controllers.has(id)) controllers.get(id).abort(new Error('已删除'))
      await store.remove(id)
      return json(res, 200, { ok: true })
    }],
    ['image', async (req, res) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') throw new Error('只支持 GET')
      const url = new URL(req.url || '/', 'http://localhost')
      const record = store.find(url.searchParams.get('record') || '')
      if (!record) return json(res, 404, { error: '记录不存在' })
      const thumbPath = join(store.thumbDir, `${record.id}.webp`)
      if (url.searchParams.get('thumb') === '1' && existsSync(thumbPath)) {
        const data = readFileSync(thumbPath)
        res.writeHead(200, {
          'content-type': 'image/webp',
          'content-length': data.length,
          'cache-control': 'private, max-age=86400',
        })
        if (req.method === 'HEAD') return res.end()
        return res.end(data)
      }
      const stored = await ctx.attachments.readImage(record.image)
      res.writeHead(200, {
        'content-type': stored.ref.mediaType,
        'content-length': stored.data.length,
        'cache-control': 'private, max-age=86400',
      })
      if (req.method === 'HEAD') return res.end()
      return res.end(Buffer.from(stored.data))
    }],
  ]

  for (const [route, handler] of routes) {
    ctx.effect(() => ctx.webServer.register({
      kind: 'exact',
      path: `${API}/${route}`,
      handler: async (req, res) => {
        try {
          if (req.method === 'POST') assertJsonRequest(req)
          await handler(req, res)
        } catch (error) {
          const message = error && error.message ? error.message : String(error)
          if (!res.headersSent) {
            res.writeHead(error && error.status ? error.status : 500, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
            res.end(JSON.stringify({ error: message }))
          } else {
            res.end()
          }
        }
      },
    }), `prompt-reverse route ${route}`)
  }

  // -------------------------------------------------------------------------
  // Agent tools
  // -------------------------------------------------------------------------

  const textOutput = {
    schema: {
      type: 'object',
      properties: { result: { type: 'string' } },
      required: ['result'],
      additionalProperties: false,
    },
    render: (_args, value) => [{ type: 'text', text: value.result }],
  }

  ctx.tools.register({
    name: 'prompt_reverse_analyze',
    description: '把一张人物图片存进「反推台」并反推出可复用的身份锁定提示词。接受本机绝对路径、~/ 路径，或对话里真实的图片附件引用。会等待视觉模型完成（最长约 4 分钟），返回记录 id、身份卡数值、正向/负向/参考图编辑提示词。用于用户说“把这张图反推一下 / 记到反推台 / 给我同一个人物的提示词”。',
    timeoutMs: 300000,
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: '本机图片绝对路径或 ~/ 路径；与 attachment 二选一。' },
        attachment: {
          type: 'object',
          additionalProperties: false,
          description: '对话图片的完整附件引用；与 path 二选一，不要只传哈希。',
          properties: {
            attachmentId: { type: 'string' },
            mediaType: { type: 'string' },
            bytes: { type: 'integer' },
            width: { type: 'integer' },
            height: { type: 'integer' },
            name: { type: 'string' },
            originalDimensions: {
              type: 'object',
              additionalProperties: false,
              properties: {
                width: { type: 'integer' },
                height: { type: 'integer' },
              },
              required: ['width', 'height'],
            },
          },
          required: ['attachmentId', 'mediaType', 'bytes', 'width', 'height'],
        },
        title: { type: 'string', description: '可选记录名；不填则用文件名或模型给的名字。' },
        wait: { type: 'boolean', description: '默认 true，等待反推完成；false 只入库并启动后台分析。' },
      },
      additionalProperties: false,
    },
    output: textOutput,
    async execute(args) {
      let record
      if (args.attachment) {
        const ref = args.attachment
        record = await createRecord({
          attachment: ref,
          mediaType: ref.mediaType,
          name: ref.name || '',
          title: args.title || '',
        })
      } else if (args.path) {
        const path = args.path.startsWith('~/') ? join(homedir(), args.path.slice(2)) : args.path
        const mediaType = mediaTypeFromPath(path)
        if (!mediaType) throw new Error('无法从扩展名判断图片类型，请用 PNG / JPEG / WebP / GIF')
        const buffer = await readFile(path)
        record = await createRecord({ buffer, mediaType, name: path.split(/[\\/]/u).pop() || '', title: args.title || '' })
      } else {
        throw new Error('需要 path 或 attachment')
      }

      await startAnalysis(record.id)
      if (args.wait !== false) await waitFor(record.id)
      const fresh = store.find(record.id) || record
      return {
        result: JSON.stringify({
          id: fresh.id,
          status: fresh.status,
          error: fresh.error || '',
          title: fresh.title,
          vision: fresh.provider ? `${fresh.provider}/${fresh.model}` : '',
          analysis: fresh.analysis,
          prompts: fresh.prompts,
          params: fresh.params,
          note: fresh.status === 'ready'
            ? '已存入反推台。要生成同一人物，把 prompts.full_zh（或 full_en）交给 qwen_generate_image；有原图时用 reference_edit_zh + 原图做 <image1>，并固定尺寸与 seed。'
            : '已入库，但反推未完成；用 prompt_reverse_get 查询，或在反推台里重试。',
        }),
      }
    },
  })

  ctx.tools.register({
    name: 'prompt_reverse_list',
    description: '列出反推台里的记录（最近 80 条）：id、标题、状态、模型、创建时间。用于用户问“反推台里有哪些图 / 上次那个提示词在哪”。',
    timeoutMs: 10000,
    parameters: {
      type: 'object',
      properties: {
        limit: { type: 'integer', description: '最多返回多少条，默认 20，最大 80。' },
      },
      additionalProperties: false,
    },
    output: textOutput,
    async execute(args) {
      const limit = Math.max(1, Math.min(80, Number.isFinite(args.limit) ? args.limit : 20))
      return {
        result: JSON.stringify(store.list().slice(0, limit).map((record) => ({
          id: record.id,
          title: record.title,
          status: record.status,
          vision: record.provider ? `${record.provider}/${record.model}` : '',
          createdAt: record.createdAt,
        }))),
      }
    },
  })

  ctx.tools.register({
    name: 'prompt_reverse_get',
    description: '取一条反推记录：身份卡、比例数值、正向/负向/参考图编辑提示词、生成参数、偏差修正表，以及模型原始输出。用于用户说“把上次那个提示词给我 / 按那个身份再生成”。',
    timeoutMs: 10000,
    parameters: {
      type: 'object',
      properties: {
        id: { type: 'string', description: '反推记录 id。' },
      },
      required: ['id'],
      additionalProperties: false,
    },
    output: textOutput,
    async execute(args) {
      const record = store.find(args.id)
      if (!record) throw new Error('记录不存在')
      return { result: JSON.stringify({ ...toPublic(record), raw: record.raw || '' }) }
    },
  })

  ctx.tools.register({
    name: 'prompt_reverse_update',
    description: '校正一条反推记录的身高、头身比、年龄区间或性别，并用确定性模板重编译全部提示词。用于用户说“她其实 172 / 头身比改成 8 / 年龄改成 30 左右”。返回更新后的提示词。',
    timeoutMs: 10000,
    parameters: {
      type: 'object',
      properties: {
        id: { type: 'string', description: '反推记录 id。' },
        height_cm: { type: 'number', description: '校正身高（120-220）；传 null 清除。' },
        head_units: { type: 'number', description: '校正头身比（5.5-9.5）；传 null 清除。' },
        age_range: { type: 'string', description: '校正年龄区间，如 "28-32"。' },
        gender: { type: 'string', description: 'female / male / androgynous / unknown。' },
        anatomy_note: { type: 'string', description: '可选：手动补充解剖/手部动作，例如“右手食指与中指将大阴唇向两侧剥开”。会追加到身体细节与手机版提示词。' },
        title: { type: 'string', description: '可选，改记录名。' },
      },
      required: ['id'],
      additionalProperties: false,
    },
    output: textOutput,
    async execute(args) {
      const record = store.find(args.id)
      if (!record) throw new Error('记录不存在')
      if (!record.analysis) throw new Error('这条记录还没有分析结果')
      const overrides = record.overrides || {}
      if (args.height_cm !== undefined) overrides.height_cm = args.height_cm === null ? null : int(args.height_cm, 120, 220)
      if (args.head_units !== undefined) overrides.head_units = args.head_units === null ? null : num(args.head_units, 5.5, 9.5)
      if (args.age_range !== undefined) overrides.age_range = str(args.age_range, 20)
      if (args.gender !== undefined && ['female', 'male', 'androgynous', 'unknown'].includes(args.gender)) overrides.gender = args.gender
      if (args.anatomy_note !== undefined) overrides.anatomy_note = str(args.anatomy_note, 1200)
      record.overrides = overrides
      if (args.title !== undefined) {
        record.title = str(args.title, 60) || record.title
        record.titleLocked = true
      }
      const effective = applyOverrides(record.analysis, overrides)
      const { params, ...promptBlocks } = compilePrompts(effective, overrides)
      record.prompts = promptBlocks
      record.params = params
      await persist(record)
      return { result: JSON.stringify({ id: record.id, title: record.title, overrides, prompts: record.prompts, params: record.params }) }
    },
  })

  ctx.effect(() => () => {
    for (const controller of controllers.values()) {
      try { controller.abort(new Error('插件已卸载')) } catch {}
    }
    controllers.clear()
  }, 'prompt-reverse abort running analyses')

  // 启动时把上次被中断的 analyzing 记录标成 error，避免界面永远转圈。
  let repaired = false
  for (const record of store.list()) {
    if (record.status === 'analyzing') {
      record.status = 'error'
      record.error = '上次分析被中断，请点「重新反推」。'
      record.updatedAt = nowIso()
      repaired = true
    }
  }
  if (repaired) void store.save()
}

function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(JSON.stringify(value))
}

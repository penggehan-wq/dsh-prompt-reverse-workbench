window.__ModuleLoader__.load({
  id: '@local/prompt-reverse-workbench',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const NS = 'promptReverse'
    const API = '/api/prompt-reverse'

    const zh = {
      panel: '反推台',
      title: '图片提示词反推工作台',
      subtitle: '一张图，锁住脸、身材和身高比例',
      upload: '上传图片',
      uploading: '上传中…',
      records: '记录',
      recordsTotal: '条',
      emptyRail: '还没有记录，先上传一张人物图。',
      emptyTitle: '把人物图拖进来',
      emptyHint: '支持 PNG / JPEG / WebP / GIF，单张不超过 40MB；也可以直接 Ctrl+V 粘贴。',
      drop: '拖入图片，或点击选择文件',
      paste: '也可以直接 Ctrl+V 粘贴',
      step1: '上传',
      step1d: '视觉模型先看脸，再看身材、服装与机位',
      step2: '反推',
      step2d: '输出身份卡、比例数字和可编辑的提示词',
      step3: '复制',
      step3d: '正向、负向、参考图编辑指令一次给全',
      heightNote: '图像无法精确测高：绝对身高只是估算，真正锁住“身高感”的是头身比、肩宽、腰臀比和机位。校正数值后，提示词会用同一套模板重编译。',
      statusNew: '待反推',
      statusAnalyzing: '分析中',
      statusReady: '已完成',
      statusError: '失败',
      analyze: '开始反推',
      retry: '重新反推',
      delete: '删除',
      export: '导出 JSON',
      copyAll: '复制提示词包',
      copy: '复制',
      copied: '已复制',
      saved: '已保存并重编译',
      mainZh: '主提示词 · 中文',
      mainEn: '主提示词 · 英文',
      identityZh: '身份锁定 · 中文',
      identityEn: '身份锁定 · 英文',
      referenceEdit: '参考图编辑指令',
      referenceEditHint: '用在 Qwen 原生参考编辑 / 多图参考：原图作为 <image1>，只描述要改的部分。',
      referenceEditGeneric: '参考图编辑 · 通用',
      referenceEditGenericHint: '给 Seedream / Flux Kontext / Gemini / 豆包参考图：不要 <image1>，把原图上传到参考图即可。',
      negative: '负向提示词',
      sheet: '三视图角色设定',
      sheetHint: '先生成三视图定稿，再拿它当后续生成的固定身份参考。',
      compact: '一句话精简',
      identityCard: '身份卡',
      summary: '摘要',
      confidence: '置信度',
      height: '身高',
      heightRange: '估高区间',
      headUnits: '头身比',
      faceRatio: '面宽/面高',
      ipd: '瞳距/面宽',
      noseRatio: '鼻宽/面宽',
      mouthRatio: '嘴宽/面宽',
      shoulderHead: '肩宽/头宽',
      shoulderHip: '肩臀比',
      waistHip: '腰臀比',
      legBody: '腿身比',
      bodyFat: '体脂估算',
      face: '面部',
      body: '身材',
      wardrobe: '服装',
      camera: '机位',
      lighting: '光线',
      style: '风格',
      warnings: '注意',
      correction: '校正数值',
      correctionHint: '改完点保存，提示词会用同一套模板重编译；不会重新调用视觉模型。',
      save: '保存并重编译',
      saving: '保存中…',
      titleField: '记录名',
      anatomyNote: '身体 / 手部动作补充',
      anatomyNoteHint: '例如：右手食指与中指把大阴唇向两侧剥开；左手放在小腹。会追加到身体细节和手机版。',
      ageField: '年龄区间',
      genderField: '性别',
      genderFemale: '女性',
      genderMale: '男性',
      genderAndrogynous: '中性',
      genderUnknown: '不确定',
      params: '参数与复现',
      size: '尺寸',
      steps: '步数',
      guidance: 'Guidance',
      scheduler: '调度器',
      seed: '种子',
      seedHint: '首次随机，满意后固定',
      rules: '复现规则',
      drift: '偏差修正',
      beforeCheck: '生成前',
      afterCheck: '生成后对照',
      pre1: '先出一张半身定妆照，不要直接上全身',
      pre2: '固定模型、尺寸与 seed，再做对照',
      pre3: '机位齐胸，焦段 50–85mm，避免广角近摄',
      pre4: '一次只改一个变量：服装 → 场景 → 机位',
      pre5: '正向词与负向词一起用，负向词配 guidance 2.5',
      pre6: '有原图时优先走参考图编辑，而不是纯文生图',
      post1: '脸型与面宽/面高一致',
      post2: '瞳距、鼻宽、嘴宽没有变',
      post3: '头身比与肩宽一致，没有显矮或肩窄',
      post4: '腰臀比、腿身比一致',
      post5: '发型、发色、发际线一致',
      post6: '年龄感、肤色与气质一致',
      deleteConfirm: '删除这条反推记录？',
      noAnalysis: '还没有分析结果',
      analyzingHint: '视觉模型正在量比例，通常 20–90 秒；完成后本页会自动刷新。',
      errorTitle: '反推失败',
      selectHint: '从左侧选一条记录',
      model: '视觉模型',
      notRun: '未运行',
      locks: '身份锚点（换装时先删服装/道具项）',
      ethnicity: '族裔 / 骨相',
      faceDetails: '面部细节',
      expressionHint: '表情提示',
      facialHair: '胡须',
      moles: '痣',
      scars: '疤',
      freckles: '雀斑',
      birthmarks: '胎记',
      piercings: '穿孔',
      tattoos: '纹身',
      makeup: '妆容',
      teeth: '牙齿 / 笑容',
      gaze: '视线',
      skinDetails: '皮肤细节',
      qualityLock: '质感锁定',
      anatomyPrompt: '身体细节（参考图可见）',
      technical: '原图质感 / 参数',
      medium: '介质',
      camera: '相机',
      lens: '镜头',
      aperture: '光圈',
      iso: 'ISO',
      shutter: '快门',
      focal: '焦段',
      grain: '颗粒',
      skinTexture: '皮肤质感',
      colorGrade: '调色',
      dof: '景深',
      quality: '整体质感',
      mobileTitle: '手机一键版',
      mobileHint: '整段复制，直接粘到豆包 / 即梦 / 其他文生图；没有 <image1>，没有负向词。',
      mobileNote: '文生图锁不住真实身份；要锁脸请用参考图编辑。衣服/场景可以直接在这一段里改。',
      copyMobile: '复制这段去手机',
      resetMobile: '恢复生成版',
      fitHint: '复制后直接粘到图像页；有原图时优先参考图编辑，把原图作为 <image1>。',
      bestPathTitle: '最稳的复现路径',
      bestPath: '原图作为 <image1> 走参考图编辑 / 多图参考，提示词只写要改的部分；纯文生图只能锁比例与风格，锁不住真实身份。',
      raw: '模型原始输出',
      rawShow: '查看原始 JSON',
      rawHide: '收起原始 JSON',
      retryHint: '可以直接重试，不会影响其它记录。',
      noPrompts: '提示词还没有生成。',
      imageAlt: '反推原图',
      totalRecords: '共',
    }

    const en = {
      panel: 'Reverse',
      title: 'Prompt Reverse Workbench',
      subtitle: 'Lock face, build and height ratio from one image',
      upload: 'Upload',
      uploading: 'Uploading…',
      records: 'Records',
      recordsTotal: '',
      emptyRail: 'No records yet. Upload a portrait to start.',
      emptyTitle: 'Drop a portrait here',
      emptyHint: 'PNG / JPEG / WebP / GIF, up to 40MB. You can also paste with Ctrl+V.',
      drop: 'Drop an image, or click to choose a file',
      paste: 'or paste with Ctrl+V',
      step1: 'Upload',
      step1d: 'The vision model reads the face first, then build, wardrobe and camera',
      step2: 'Analyze',
      step2d: 'Get an identity card, proportion numbers and editable prompts',
      step3: 'Copy',
      step3d: 'Positive, negative and reference-edit instructions in one place',
      heightNote: 'An image cannot give an exact height. Absolute cm is an estimate; what actually holds the height impression is head units, shoulder width, waist-to-hip ratio and camera height. Correct the numbers and the prompt is recompiled with the same template.',
      statusNew: 'New',
      statusAnalyzing: 'Analyzing',
      statusReady: 'Ready',
      statusError: 'Failed',
      analyze: 'Analyze',
      retry: 'Re-analyze',
      delete: 'Delete',
      export: 'Export JSON',
      copyAll: 'Copy prompt pack',
      copy: 'Copy',
      copied: 'Copied',
      saved: 'Saved and recompiled',
      mainZh: 'Main prompt · Chinese',
      mainEn: 'Main prompt · English',
      identityZh: 'Identity lock · Chinese',
      identityEn: 'Identity lock · English',
      referenceEdit: 'Reference-edit instruction',
      referenceEditHint: 'For Qwen native reference edit / multi-image: original as <image1>, describe only what changes.',
      referenceEditGeneric: 'Reference edit · generic',
      referenceEditGenericHint: 'For Seedream / Flux Kontext / Gemini / Doubao reference images: no <image1>; upload the original as reference.',
      negative: 'Negative prompt',
      sheet: 'Character sheet prompt',
      sheetHint: 'Generate a sheet first, then reuse it as the fixed identity reference.',
      compact: 'One-line compact',
      identityCard: 'Identity card',
      summary: 'Summary',
      confidence: 'Confidence',
      height: 'Height',
      heightRange: 'Height range',
      headUnits: 'Head units',
      faceRatio: 'Face W/H',
      ipd: 'IPD / face width',
      noseRatio: 'Nose / face width',
      mouthRatio: 'Mouth / face width',
      shoulderHead: 'Shoulder / head width',
      shoulderHip: 'Shoulder / hip',
      waistHip: 'Waist / hip',
      legBody: 'Leg / body',
      bodyFat: 'Body fat estimate',
      face: 'Face',
      body: 'Body',
      wardrobe: 'Wardrobe',
      camera: 'Camera',
      lighting: 'Lighting',
      style: 'Style',
      warnings: 'Warnings',
      correction: 'Correct values',
      correctionHint: 'Save to recompile the prompt with the same template; the vision model is not called again.',
      save: 'Save & recompile',
      saving: 'Saving…',
      titleField: 'Title',
      anatomyNote: 'Body / hand action note',
      anatomyNoteHint: 'e.g. right index and middle fingers spread the labia majora apart; left hand rests on the lower abdomen. Appended to anatomy and mobile prompt.',
      ageField: 'Age range',
      genderField: 'Gender',
      genderFemale: 'Female',
      genderMale: 'Male',
      genderAndrogynous: 'Androgynous',
      genderUnknown: 'Unknown',
      params: 'Parameters',
      size: 'Size',
      steps: 'Steps',
      guidance: 'Guidance',
      scheduler: 'Scheduler',
      seed: 'Seed',
      seedHint: 'random first, lock after',
      rules: 'Reproduction rules',
      drift: 'Drift fixes',
      beforeCheck: 'Before generating',
      afterCheck: 'After generating',
      pre1: 'Start with a half-body identity shot, not a full-body scene',
      pre2: 'Fix model, size and seed before comparing',
      pre3: 'Camera at chest height, 50–85mm; avoid wide-angle close-ups',
      pre4: 'Change one variable at a time: wardrobe → scene → camera',
      pre5: 'Use positive and negative together; negative with guidance 2.5',
      pre6: 'With an original image, prefer reference edit over pure text-to-image',
      post1: 'Face shape and face width/height match',
      post2: 'IPD, nose width and mouth width unchanged',
      post3: 'Head units and shoulder width match; not shorter, not narrower',
      post4: 'Waist-to-hip and leg-to-body match',
      post5: 'Hair style, colour and hairline match',
      post6: 'Apparent age, skin tone and presence match',
      deleteConfirm: 'Delete this reverse record?',
      noAnalysis: 'No analysis yet',
      analyzingHint: 'The vision model is measuring proportions, usually 20–90s; this page refreshes automatically.',
      errorTitle: 'Analysis failed',
      selectHint: 'Select a record on the left',
      model: 'Vision model',
      notRun: 'Not run',
      locks: 'Identity anchors (drop clothing/props when restyling)',
      ethnicity: 'Ethnicity / bone structure',
      faceDetails: 'Facial details',
      expressionHint: 'Expression hint',
      facialHair: 'Facial hair',
      moles: 'Moles',
      scars: 'Scars',
      freckles: 'Freckles',
      birthmarks: 'Birthmarks',
      piercings: 'Piercings',
      tattoos: 'Tattoos',
      makeup: 'Makeup',
      teeth: 'Teeth / smile',
      gaze: 'Gaze',
      skinDetails: 'Skin details',
      qualityLock: 'Quality lock',
      anatomyPrompt: 'Visible body detail',
      technical: 'Reference quality / camera',
      medium: 'Medium',
      camera: 'Camera',
      lens: 'Lens',
      aperture: 'Aperture',
      iso: 'ISO',
      shutter: 'Shutter',
      focal: 'Focal length',
      grain: 'Grain',
      skinTexture: 'Skin texture',
      colorGrade: 'Color grade',
      dof: 'Depth of field',
      quality: 'Overall quality',
      mobileTitle: 'Mobile one-tap',
      mobileHint: 'Copy the whole block into Doubao / Jimeng / any text-to-image; no <image1>, no negative prompt.',
      mobileNote: 'Text-to-image cannot lock a real identity; use reference edit for that. Edit the outfit/scene right here.',
      copyMobile: 'Copy for mobile',
      resetMobile: 'Reset generated',
      fitHint: 'Paste into the image page; with an original image, prefer reference edit and pass it as <image1>.',
      bestPathTitle: 'Most stable path',
      bestPath: 'Use the original as <image1> with reference edit / multi-image; describe only what changes. Pure text-to-image locks proportions and style, not a real identity.',
      raw: 'Raw model output',
      rawShow: 'Show raw JSON',
      rawHide: 'Hide raw JSON',
      retryHint: 'You can retry directly; other records are unaffected.',
      noPrompts: 'Prompts are not generated yet.',
      imageAlt: 'reference image',
      totalRecords: 'total',
    }

    function useT(ctx) {
      const [, force] = React.useReducer((x) => x + 1, 0)
      React.useEffect(() => ctx.locale.subscribe(force), [ctx])
      return ctx.locale.bind(NS)
    }

    async function api(path, init) {
      const response = await fetch(`${API}/${path}`, init)
      const contentType = response.headers.get('content-type') || ''
      const value = contentType.includes('application/json') ? await response.json() : await response.text()
      if (!response.ok) throw new Error(value && value.error ? value.error : `HTTP ${response.status}`)
      return value
    }

    function post(path, body) {
      return api(path, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
    }

    function readFileBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = String(reader.result || '')
          const index = result.indexOf(',')
          resolve(index >= 0 ? result.slice(index + 1) : '')
        }
        reader.onerror = () => reject(reader.error || new Error('读取图片失败'))
        reader.readAsDataURL(file)
      })
    }

    function guessMediaType(file) {
      if (file.type && file.type.startsWith('image/')) return file.type
      const name = (file.name || '').toLowerCase()
      if (name.endsWith('.png')) return 'image/png'
      if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg'
      if (name.endsWith('.webp')) return 'image/webp'
      if (name.endsWith('.gif')) return 'image/gif'
      return ''
    }

    function formatDate(iso) {
      if (!iso) return ''
      try {
        return new Date(iso).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      } catch {
        return iso
      }
    }

    function value(v, suffix = '') {
      return v === null || v === undefined || v === '' ? '—' : `${v}${suffix}`
    }

    function CopyButton({ text, t, onNotice, label }) {
      const [done, setDone] = React.useState(false)
      const copy = async () => {
        if (!text) return
        try {
          await navigator.clipboard.writeText(text)
        } catch {
          const area = document.createElement('textarea')
          area.value = text
          area.style.position = 'fixed'
          area.style.opacity = '0'
          document.body.appendChild(area)
          area.select()
          document.execCommand('copy')
          area.remove()
        }
        setDone(true)
        onNotice(t('copied'))
        window.setTimeout(() => setDone(false), 1400)
      }
      return h('button', { type: 'button', className: 'prw-btn prw-btn-sm', onClick: copy, disabled: !text }, done ? t('copied') : (label || t('copy')))
    }

    function PromptCard({ title, hint, text, t, onNotice }) {
      return h('section', { className: 'prw-card' },
        h('header', { className: 'prw-card-head' },
          h('div', null,
            h('h3', null, title),
            hint ? h('p', { className: 'prw-card-hint' }, hint) : null,
          ),
          h(CopyButton, { text, t, onNotice }),
        ),
        h('pre', { className: 'prw-prompt' }, text || t('noPrompts')),
      )
    }

    function StatusDot({ status }) {
      return h('span', { className: `prw-dot prw-dot-${status || 'new'}`, 'aria-hidden': true })
    }

    function Chip({ children, tone }) {
      return h('span', { className: `prw-chip${tone ? ` prw-chip-${tone}` : ''}` }, children)
    }

    function EmptyState({ t, busy, drag, setDrag, onPick, onDrop }) {
      return h('div', { className: 'prw-empty' },
        h('div', {
          className: `prw-drop${drag ? ' is-drag' : ''}`,
          role: 'button',
          tabIndex: 0,
          onClick: onPick,
          onKeyDown: (event) => {
            if (event.key === 'Enter' || event.key === ' ') onPick()
          },
          onDragOver: (event) => { event.preventDefault(); setDrag(true) },
          onDragLeave: () => setDrag(false),
          onDrop: (event) => { event.preventDefault(); event.stopPropagation(); setDrag(false); onDrop(event.dataTransfer.files) },
        },
          h('div', { className: 'prw-drop-icon' }, h(Icon, { size: 44 })),
          h('h2', null, busy ? t('uploading') : t('emptyTitle')),
          h('p', null, t('drop')),
          h('p', { className: 'prw-muted' }, t('paste')),
        ),
        h('p', { className: 'prw-footnote' }, t('emptyHint')),
        h('div', { className: 'prw-steps' },
          [
            ['01', t('step1'), t('step1d')],
            ['02', t('step2'), t('step2d')],
            ['03', t('step3'), t('step3d')],
          ].map(([number, title, detail]) => h('div', { className: 'prw-step', key: number },
            h('span', { className: 'prw-step-num' }, number),
            h('div', null, h('strong', null, title), h('p', null, detail)),
          )),
        ),
        h('p', { className: 'prw-note' }, t('heightNote')),
      )
    }

    function Metric({ label, value: metricValue, suffix }) {
      return h('div', { className: 'prw-metric' },
        h('span', null, label),
        h('strong', null, value(metricValue, suffix || '')),
      )
    }

    function CorrectionForm({ record, t, onUpdated, onNotice }) {
      const analysis = record.analysis || {}
      const overrides = record.overrides || {}
      const [draft, setDraft] = React.useState(() => ({
        title: record.title || '',
        height: overrides.height_cm ?? analysis.body?.height_cm ?? '',
        head: overrides.head_units ?? analysis.body?.head_units ?? '',
        age: overrides.age_range ?? analysis.age_range ?? '',
        gender: overrides.gender ?? analysis.gender ?? 'unknown',
        anatomyNote: overrides.anatomy_note ?? '',
      }))
      const [saving, setSaving] = React.useState(false)

      React.useEffect(() => {
        const current = record.overrides || {}
        const data = record.analysis || {}
        setDraft({
          title: record.title || '',
          height: current.height_cm ?? data.body?.height_cm ?? '',
          head: current.head_units ?? data.body?.head_units ?? '',
          age: current.age_range ?? data.age_range ?? '',
          gender: current.gender ?? data.gender ?? 'unknown',
          anatomyNote: current.anatomy_note ?? '',
        })
      }, [record.id, record.updatedAt])

      const update = (key) => (event) => setDraft((prev) => ({ ...prev, [key]: event.target.value }))

      const save = async () => {
        setSaving(true)
        try {
          const originalHeight = analysis.body?.height_cm ?? ''
          const originalHead = analysis.body?.head_units ?? ''
          const originalAge = analysis.age_range ?? ''
          const originalGender = analysis.gender ?? 'unknown'
          const payload = { id: record.id, overrides: {} }
          if (String(draft.height) !== String(originalHeight)) payload.overrides.height_cm = draft.height === '' ? null : Number(draft.height)
          if (String(draft.head) !== String(originalHead)) payload.overrides.head_units = draft.head === '' ? null : Number(draft.head)
          if (draft.age !== originalAge) payload.overrides.age_range = draft.age
          if (draft.gender !== originalGender) payload.overrides.gender = draft.gender
          if (draft.anatomyNote !== (record.overrides?.anatomy_note || '')) payload.overrides.anatomy_note = draft.anatomyNote
          if (draft.title.trim() && draft.title.trim() !== record.title) payload.title = draft.title.trim()
          const out = await post('update', payload)
          onUpdated(out.record)
          onNotice(t('saved'))
        } catch (error) {
          onNotice(error.message)
        } finally {
          setSaving(false)
        }
      }

      return h('section', { className: 'prw-card' },
        h('header', { className: 'prw-card-head' },
          h('div', null,
            h('h3', null, t('correction')),
            h('p', { className: 'prw-card-hint' }, t('correctionHint')),
          ),
          h('button', { type: 'button', className: 'prw-btn prw-btn-primary prw-btn-sm', onClick: save, disabled: saving },
            saving ? t('saving') : t('save')),
        ),
        h('div', { className: 'prw-form' },
          h('label', { className: 'prw-field' }, h('span', null, t('titleField')),
            h('input', { className: 'prw-input', value: draft.title, onChange: update('title'), maxLength: 60 })),
          h('label', { className: 'prw-field' }, h('span', null, t('height')),
            h('input', { className: 'prw-input', type: 'number', min: 120, max: 220, step: 1, value: draft.height, onChange: update('height') })),
          h('label', { className: 'prw-field' }, h('span', null, t('headUnits')),
            h('input', { className: 'prw-input', type: 'number', min: 5.5, max: 9.5, step: 0.01, value: draft.head, onChange: update('head') })),
          h('label', { className: 'prw-field' }, h('span', null, t('ageField')),
            h('input', { className: 'prw-input', value: draft.age, onChange: update('age'), placeholder: '24-28' })),
          h('label', { className: 'prw-field' }, h('span', null, t('genderField')),
            h('select', { className: 'prw-input', value: draft.gender, onChange: update('gender') },
              h('option', { value: 'female' }, t('genderFemale')),
              h('option', { value: 'male' }, t('genderMale')),
              h('option', { value: 'androgynous' }, t('genderAndrogynous')),
              h('option', { value: 'unknown' }, t('genderUnknown')),
            )),
          h('label', { className: 'prw-field prw-field-wide' }, h('span', null, t('anatomyNote')),
            h('textarea', { className: 'prw-input prw-textarea', rows: 3, value: draft.anatomyNote, placeholder: t('anatomyNoteHint'), onChange: update('anatomyNote') })),
        ),
      )
    }

    function RawView({ record, t }) {
      const [open, setOpen] = React.useState(false)
      const [raw, setRaw] = React.useState('')
      const [error, setError] = React.useState('')
      React.useEffect(() => { setOpen(false); setRaw(''); setError('') }, [record.id])
      const toggle = async () => {
        if (open) return setOpen(false)
        try {
          const out = await api(`record?id=${encodeURIComponent(record.id)}`)
          setRaw(out.raw || '')
          setOpen(true)
        } catch (e) {
          setError(e.message)
        }
      }
      return h('div', { className: 'prw-raw' },
        h('button', { type: 'button', className: 'prw-link', onClick: toggle }, open ? t('rawHide') : t('rawShow')),
        error ? h('p', { className: 'prw-error-inline' }, error) : null,
        open ? h('pre', { className: 'prw-prompt prw-raw-pre' }, raw || t('noPrompts')) : null,
      )
    }

    function MobileCard({ record, t, onNotice }) {
      const generated = (record.prompts && (record.prompts.mobile_zh || record.prompts.compact_zh || record.prompts.full_zh)) || ''
      const [text, setText] = React.useState(generated)
      React.useEffect(() => { setText(generated) }, [record.id, record.updatedAt])
      return h('section', { className: 'prw-card prw-mobile' },
        h('header', { className: 'prw-card-head' },
          h('div', null,
            h('h3', null, t('mobileTitle')),
            h('p', { className: 'prw-card-hint' }, t('mobileHint')),
          ),
          h(CopyButton, { text, t, onNotice, label: t('copyMobile') }),
        ),
        h('textarea', {
          className: 'prw-mobile-input',
          value: text,
          onChange: (event) => setText(event.target.value),
          rows: 5,
          spellCheck: false,
        }),
        h('div', { className: 'prw-mobile-foot' },
          h('span', null, `${text.length} 字`),
          h('button', { type: 'button', className: 'prw-link', onClick: () => setText(generated) }, t('resetMobile')),
        ),
        h('p', { className: 'prw-muted' }, (record.prompts && record.prompts.mobile_note_zh) || t('mobileNote')),
      )
    }

    function RecordView({ record, t, onAnalyze, onDelete, onExport, onCopyAll, onUpdated, onNotice, busy }) {
      const analysis = record.analysis || {}
      const prompts = record.prompts || null
      const params = record.params || (prompts && prompts.params) || null
      const overrides = record.overrides || {}
      const body = analysis.body || {}
      const proportions = analysis.proportions || {}
      const camera = analysis.camera || {}
      const effectiveHeight = overrides.height_cm ?? body.height_cm
      const effectiveHead = overrides.head_units ?? body.head_units
      const effectiveAge = overrides.age_range || analysis.age_range
      const effectiveGender = overrides.gender || analysis.gender
      const genderLabel = effectiveGender === 'female' ? t('genderFemale')
        : effectiveGender === 'male' ? t('genderMale')
          : effectiveGender === 'androgynous' ? t('genderAndrogynous') : t('genderUnknown')

      return h('div', { className: 'prw-detail' },
        h('section', { className: 'prw-hero' },
          h('div', { className: 'prw-hero-image' },
            h('img', { src: `${API}/image?record=${encodeURIComponent(record.id)}`, alt: t('imageAlt') }),
          ),
          h('div', { className: 'prw-hero-meta' },
            h('div', { className: 'prw-hero-title' },
              h('h2', null, record.title || '—'),
              h(StatusDot, { status: record.status }),
              h('span', { className: `prw-status-text prw-status-${record.status}` },
                record.status === 'ready' ? t('statusReady')
                  : record.status === 'analyzing' ? t('statusAnalyzing')
                    : record.status === 'error' ? t('statusError') : t('statusNew')),
            ),
            h('div', { className: 'prw-badges' },
              record.provider ? h(Chip, null, `${record.provider}/${record.model}${record.effort ? ` · ${record.effort}` : ''}`) : null,
              effectiveAge ? h(Chip, null, effectiveAge) : null,
              h(Chip, null, genderLabel),
              h(Chip, null, formatDate(record.createdAt)),
              record.image ? h(Chip, null, `${record.image.width}×${record.image.height}`) : null,
            ),
            analysis.summary_zh ? h('p', { className: 'prw-summary' }, analysis.summary_zh) : null,
            h('div', { className: 'prw-actions' },
              h('button', {
                type: 'button',
                className: 'prw-btn prw-btn-primary',
                onClick: () => onAnalyze(record),
                disabled: busy || record.status === 'analyzing',
              }, record.status === 'error' ? t('retry') : record.status === 'ready' ? t('retry') : t('analyze')),
              h('button', { type: 'button', className: 'prw-btn', onClick: () => onCopyAll(record), disabled: !prompts }, t('copyAll')),
              h('button', { type: 'button', className: 'prw-btn', onClick: () => onExport(record), disabled: !analysis }, t('export')),
              h('button', { type: 'button', className: 'prw-btn prw-btn-danger', onClick: () => onDelete(record), disabled: busy }, t('delete')),
            ),
            h('p', { className: 'prw-muted prw-hero-hint' }, t('fitHint')),
          ),
        ),

        record.status === 'analyzing' ? h('section', { className: 'prw-card prw-progress' },
          h('div', { className: 'prw-progress-bar' }, h('span', null)),
          h('p', null, t('analyzingHint')),
          record.provider ? h('p', { className: 'prw-muted' }, `${t('model')}: ${record.provider}/${record.model}`) : null,
        ) : null,

        record.status === 'error' ? h('section', { className: 'prw-card prw-error-box' },
          h('h3', null, t('errorTitle')),
          h('p', null, record.error || '—'),
          h('p', { className: 'prw-muted' }, t('retryHint')),
        ) : null,

        record.status === 'ready' && prompts ? h(React.Fragment, null,
          h('div', { className: 'prw-best' },
            h('strong', null, t('bestPathTitle')),
            h('span', null, t('bestPath')),
          ),
          h(MobileCard, { record, t, onNotice }),
          h('div', { className: 'prw-prompt-grid' },
            h(PromptCard, { title: t('mainZh'), text: prompts.full_zh, t, onNotice }),
            h(PromptCard, { title: t('mainEn'), text: prompts.full_en, t, onNotice }),
            h(PromptCard, { title: t('identityZh'), text: prompts.identity_zh, t, onNotice }),
            h(PromptCard, { title: t('identityEn'), text: prompts.identity_en, t, onNotice }),
            h(PromptCard, { title: t('referenceEdit'), hint: t('referenceEditHint'), text: prompts.reference_edit_zh, t, onNotice }),
            prompts.reference_edit_generic_zh ? h(PromptCard, { title: t('referenceEditGeneric'), hint: t('referenceEditGenericHint'), text: prompts.reference_edit_generic_zh, t, onNotice }) : null,
            h(PromptCard, { title: t('negative'), text: prompts.negative_zh, t, onNotice }),
            prompts.face_details_zh ? h(PromptCard, { title: t('faceDetails'), text: prompts.face_details_zh, t, onNotice }) : null,
            prompts.expression_hint_zh ? h(PromptCard, { title: t('expressionHint'), text: prompts.expression_hint_zh, t, onNotice }) : null,
            prompts.identity_sheet_zh ? h(PromptCard, { title: t('sheet'), hint: t('sheetHint'), text: prompts.identity_sheet_zh, t, onNotice }) : null,
            h(PromptCard, { title: t('compact'), text: prompts.compact_zh, t, onNotice }),
            prompts.quality_lock_zh ? h(PromptCard, { title: t('qualityLock'), text: prompts.quality_lock_zh, t, onNotice }) : null,
            prompts.anatomy_prompt_zh ? h(PromptCard, { title: t('anatomyPrompt'), text: prompts.anatomy_prompt_zh, t, onNotice }) : null,
          ),

          h('section', { className: 'prw-card' },
            h('header', { className: 'prw-card-head' },
              h('div', null,
                h('h3', null, t('identityCard')),
                h('p', { className: 'prw-card-hint' }, t('locks')),
              ),
              h('div', { className: 'prw-chip-row' },
                h(Chip, { tone: 'ok' }, `${t('confidence')} ${analysis.confidence?.face || '—'} / ${analysis.confidence?.body || '—'} / ${analysis.confidence?.height || '—'}`),
              ),
            ),
            h('div', { className: 'prw-metrics' },
              h(Metric, { label: t('height'), value: effectiveHeight, suffix: ' cm' }),
              h(Metric, { label: t('heightRange'), value: Array.isArray(body.height_range_cm) && body.height_range_cm.length === 2 ? `${body.height_range_cm[0]}–${body.height_range_cm[1]}` : null }),
              h(Metric, { label: t('headUnits'), value: effectiveHead }),
              h(Metric, { label: t('faceRatio'), value: proportions.face_width_height_ratio }),
              h(Metric, { label: t('ipd'), value: proportions.interpupillary_face_ratio }),
              h(Metric, { label: t('noseRatio'), value: proportions.nose_width_face_ratio }),
              h(Metric, { label: t('mouthRatio'), value: proportions.mouth_width_face_ratio }),
              h(Metric, { label: t('shoulderHead'), value: body.shoulder_width_head_units }),
              h(Metric, { label: t('shoulderHip'), value: proportions.shoulder_hip_ratio }),
              h(Metric, { label: t('waistHip'), value: proportions.waist_hip_ratio }),
              h(Metric, { label: t('legBody'), value: proportions.leg_body_ratio }),
              h(Metric, { label: t('bodyFat'), value: body.body_fat_percent, suffix: '%' }),
            ),
            h('div', { className: 'prw-locks' },
              (prompts.locks_zh || []).map((lock, index) => h(Chip, { key: index }, lock)),
            ),
            h('div', { className: 'prw-face-grid' },
              h('div', null, h('span', { className: 'prw-label' }, t('face')),
                h('p', null, analysis.face?.face_shape_zh || '—'),
                h('p', null, analysis.face?.eyes_zh || ''),
                h('p', null, analysis.face?.nose_zh || ''),
                h('p', null, analysis.face?.lips_zh || ''),
                h('p', null, analysis.face?.skin_zh || ''),
                h('p', null, analysis.face?.hair_zh || ''),
                analysis.face?.marks_zh ? h('p', null, analysis.face.marks_zh) : null,
                analysis.face?.facial_hair_zh ? h('p', null, `${t('facialHair')}：${analysis.face.facial_hair_zh}`) : null,
                analysis.face?.moles_zh ? h('p', null, `${t('moles')}：${analysis.face.moles_zh}`) : null,
                analysis.face?.scars_zh ? h('p', null, `${t('scars')}：${analysis.face.scars_zh}`) : null,
                analysis.face?.freckles_zh ? h('p', null, `${t('freckles')}：${analysis.face.freckles_zh}`) : null,
                analysis.face?.birthmarks_zh ? h('p', null, `${t('birthmarks')}：${analysis.face.birthmarks_zh}`) : null,
                analysis.face?.piercings_zh ? h('p', null, `${t('piercings')}：${analysis.face.piercings_zh}`) : null,
                analysis.face?.tattoos_zh ? h('p', null, `${t('tattoos')}：${analysis.face.tattoos_zh}`) : null,
                analysis.face?.makeup_zh ? h('p', null, `${t('makeup')}：${analysis.face.makeup_zh}`) : null,
                analysis.face?.teeth_zh ? h('p', null, `${t('teeth')}：${analysis.face.teeth_zh}`) : null,
                analysis.face?.gaze_zh ? h('p', null, `${t('gaze')}：${analysis.face.gaze_zh}`) : null,
                analysis.face?.skin_details_zh ? h('p', null, `${t('skinDetails')}：${analysis.face.skin_details_zh}`) : null,
                analysis.face?.expression_zh ? h('p', { className: 'prw-muted' }, `${t('expressionHint')}：${analysis.face.expression_zh}`) : null,
              ),
              h('div', null, h('span', { className: 'prw-label' }, t('body')),
                h('p', null, analysis.body_zh || '—'),
                body.height_method_zh ? h('p', { className: 'prw-muted' }, `${t('heightRange')}: ${body.height_method_zh}`) : null,
                h('p', { className: 'prw-muted' }, `${t('height')}: ${effectiveHeight || '—'} cm · ${t('headUnits')}: ${effectiveHead || '—'}`),
              ),
            ),
            h('div', { className: 'prw-facts' },
              analysis.ethnicity_zh || analysis.face_structure_zh
                ? h('p', null, h('strong', null, `${t('ethnicity')} · `), [analysis.ethnicity_zh, analysis.face_structure_zh].filter(Boolean).join('；'))
                : null,
              analysis.wardrobe_zh ? h('p', null, h('strong', null, `${t('wardrobe')} · `), analysis.wardrobe_zh) : null,
              analysis.scene_zh ? h('p', null, h('strong', null, `${t('camera')} · `), analysis.scene_zh) : null,
              analysis.camera_zh ? h('p', null, h('strong', null, `${t('camera')} · `), analysis.camera_zh) : null,
              analysis.lighting_zh ? h('p', null, h('strong', null, `${t('lighting')} · `), analysis.lighting_zh) : null,
              analysis.style_zh ? h('p', null, h('strong', null, `${t('style')} · `), analysis.style_zh) : null,
            ),
            analysis.warnings_zh && analysis.warnings_zh.length
              ? h('div', { className: 'prw-warning' },
                h('strong', null, `${t('warnings')}: `),
                analysis.warnings_zh.join(' · '))
              : null,
          ),

          h(CorrectionForm, { record, t, onUpdated, onNotice }),

          h('section', { className: 'prw-card' },
            h('header', { className: 'prw-card-head' },
              h('div', null,
                h('h3', null, t('params')),
                h('p', { className: 'prw-card-hint' }, params ? params.note_zh : ''),
              ),
            ),
            params ? h('div', { className: 'prw-metrics prw-metrics-4' },
              h(Metric, { label: t('size'), value: `${params.width}×${params.height}` }),
              h(Metric, { label: t('steps'), value: params.steps }),
              h(Metric, { label: t('guidance'), value: params.guidance }),
              h(Metric, { label: t('scheduler'), value: params.scheduler }),
              h(Metric, { label: t('seed'), value: params.seed ?? t('seedHint') }),
              h(Metric, { label: t('camera'), value: camera.aspect_ratio || params.aspect_ratio || '—' }),
            ) : h('p', { className: 'prw-muted' }, t('noPrompts')),
            h('div', { className: 'prw-two-col' },
              h('div', null,
                h('h4', null, t('rules')),
                h('ul', { className: 'prw-list' }, (prompts.rules_zh || []).map((rule, index) => h('li', { key: index }, rule))),
              ),
              h('div', null,
                h('h4', null, t('drift')),
                h('ul', { className: 'prw-list' }, (prompts.drift_fixes || []).map((item, index) => h('li', { key: index },
                  h('strong', null, `${item.symptom}：`), item.fix))),
              ),
            ),
          ),

          h('section', { className: 'prw-card' },
            h('header', { className: 'prw-card-head' },
              h('div', null,
                h('h3', null, t('technical')),
                h('p', { className: 'prw-card-hint' }, analysis.technical?.quality_zh || ''),
              ),
            ),
            h('div', { className: 'prw-metrics' },
              h(Metric, { label: t('medium'), value: analysis.technical?.medium_zh }),
              h(Metric, { label: t('camera'), value: analysis.technical?.camera_zh }),
              h(Metric, { label: t('lens'), value: analysis.technical?.lens_zh }),
              h(Metric, { label: t('aperture'), value: analysis.technical?.aperture }),
              h(Metric, { label: t('iso'), value: analysis.technical?.iso }),
              h(Metric, { label: t('shutter'), value: analysis.technical?.shutter }),
              h(Metric, { label: t('focal'), value: analysis.technical?.focal_length_mm, suffix: ' mm' }),
              h(Metric, { label: t('grain'), value: analysis.technical?.grain_zh }),
              h(Metric, { label: t('skinTexture'), value: analysis.technical?.skin_texture_zh }),
              h(Metric, { label: t('colorGrade'), value: analysis.technical?.color_grade_zh }),
              h(Metric, { label: t('dof'), value: analysis.technical?.depth_of_field_zh }),
              h(Metric, { label: t('quality'), value: analysis.technical?.quality_zh }),
            ),
          ),

          h('section', { className: 'prw-card' },
            h('div', { className: 'prw-two-col' },
              h('div', null,
                h('h4', null, t('beforeCheck')),
                h('ul', { className: 'prw-checklist' }, ['pre1', 'pre2', 'pre3', 'pre4', 'pre5', 'pre6'].map((key) => h('li', { key }, t(key)))),
              ),
              h('div', null,
                h('h4', null, t('afterCheck')),
                h('ul', { className: 'prw-checklist' }, ['post1', 'post2', 'post3', 'post4', 'post5', 'post6'].map((key) => h('li', { key }, t(key)))),
              ),
            ),
            h(RawView, { record, t }),
          ),
        ) : null,

        record.status === 'new' ? h('section', { className: 'prw-card prw-error-box' },
          h('h3', null, t('noAnalysis')),
          h('p', { className: 'prw-muted' }, t('retryHint')),
        ) : null,
      )
    }

    function App({ ctx }) {
      const t = useT(ctx)
      const [state, setState] = React.useState({ records: [], vision: null, total: 0 })
      const [selectedId, setSelectedId] = React.useState(null)
      const [drag, setDrag] = React.useState(false)
      const [busy, setBusy] = React.useState('')
      const [error, setError] = React.useState('')
      const [notice, setNotice] = React.useState('')
      const inputRef = React.useRef(null)

      const refresh = React.useCallback(async () => {
        try {
          const next = await api('state')
          setState(next)
          setError('')
          return next
        } catch (e) {
          setError(e.message)
          return null
        }
      }, [])

      React.useEffect(() => { void refresh() }, [refresh])
      const hasAnalyzing = state.records.some((record) => record.status === 'analyzing')
      React.useEffect(() => {
        if (!hasAnalyzing) return undefined
        const timer = window.setInterval(() => { void refresh() }, 1800)
        return () => window.clearInterval(timer)
      }, [hasAnalyzing, refresh])

      const notify = React.useCallback((message) => {
        setNotice(message)
        window.setTimeout(() => setNotice(''), 2200)
      }, [])

      const uploadFile = React.useCallback(async (file) => {
        if (!file) return
        const mediaType = guessMediaType(file)
        if (!mediaType) {
          setError('只支持 PNG / JPEG / WebP / GIF')
          return
        }
        if (file.size > 40 * 1024 * 1024) {
          setError('图片超过 40MB')
          return
        }
        setBusy('upload')
        setError('')
        try {
          const data = await readFileBase64(file)
          const out = await post('upload', { data, mediaType, name: file.name || 'upload' })
          setSelectedId(out.record.id)
          await refresh()
        } catch (e) {
          setError(e.message)
        } finally {
          setBusy('')
        }
      }, [refresh])

      React.useEffect(() => {
        const onPaste = (event) => {
          const target = event.target
          if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
          const files = event.clipboardData && event.clipboardData.files
          if (files && files.length) {
            event.preventDefault()
            void uploadFile(files[0])
          }
        }
        window.addEventListener('paste', onPaste)
        return () => window.removeEventListener('paste', onPaste)
      }, [uploadFile])

      const selected = state.records.find((record) => record.id === selectedId) || state.records[0] || null

      const pick = () => inputRef.current && inputRef.current.click()

      const dropFiles = (files) => {
        if (files && files.length) void uploadFile(files[0])
      }

      const analyze = async (record) => {
        setBusy('analyze')
        setError('')
        try {
          await post('analyze', { id: record.id })
          await refresh()
        } catch (e) {
          setError(e.message)
        } finally {
          setBusy('')
        }
      }

      const remove = async (record) => {
        if (!window.confirm(t('deleteConfirm'))) return
        setBusy('delete')
        try {
          await post('delete', { id: record.id, confirm: true })
          if (selectedId === record.id) setSelectedId(null)
          await refresh()
        } catch (e) {
          setError(e.message)
        } finally {
          setBusy('')
        }
      }

      const exportRecord = (record) => {
        const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `prompt-reverse-${record.id.slice(0, 8)}.json`
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
        window.setTimeout(() => URL.revokeObjectURL(url), 2000)
      }

      const copyAll = async (record) => {
        const text = record.prompts && record.prompts.combined_zh
        if (!text) return
        try {
          await navigator.clipboard.writeText(text)
        } catch {
          const area = document.createElement('textarea')
          area.value = text
          document.body.appendChild(area)
          area.select()
          document.execCommand('copy')
          area.remove()
        }
        notify(t('copied'))
      }

      const updateRecord = (next) => {
        setState((prev) => ({
          ...prev,
          records: prev.records.map((record) => (record.id === next.id ? next : record)),
        }))
      }

      const vision = state.vision
      const visionText = vision ? `${vision.provider}/${vision.model}${vision.effort ? ` · ${vision.effort}` : ''}` : t('notRun')

      return h('div', {
        className: 'prw-root',
        onDragOver: (event) => { event.preventDefault(); setDrag(true) },
        onDragLeave: () => setDrag(false),
        onDrop: (event) => { event.preventDefault(); setDrag(false); dropFiles(event.dataTransfer.files) },
      },
        h('style', null, css),
        h('header', { className: 'prw-head' },
          h('div', { className: 'prw-brand' },
            h('span', { className: 'prw-brand-icon' }, h(Icon, { size: 34 })),
            h('div', null,
              h('h1', null, t('title')),
              h('p', null, t('subtitle')),
            ),
          ),
          h('div', { className: 'prw-head-actions' },
            h('span', { className: 'prw-vision', title: t('model') },
              h('span', { className: 'prw-vision-dot' }),
              h('span', null, visionText),
            ),
            h('button', { type: 'button', className: 'prw-btn prw-btn-primary', onClick: pick, disabled: busy === 'upload' },
              busy === 'upload' ? t('uploading') : `+ ${t('upload')}`),
            h('input', {
              ref: inputRef,
              type: 'file',
              accept: 'image/png,image/jpeg,image/webp,image/gif',
              className: 'prw-file',
              onChange: (event) => {
                const file = event.target.files && event.target.files[0]
                event.target.value = ''
                dropFiles(file ? [file] : [])
              },
            }),
          ),
        ),
        error ? h('div', { className: 'prw-error-bar' }, h('span', null, error), h('button', {
          type: 'button', className: 'prw-link', onClick: () => setError(''),
        }, '×')) : null,
        h('div', { className: 'prw-body' },
          h('aside', { className: 'prw-rail' },
            h('div', { className: 'prw-rail-head' },
              h('span', null, t('records')),
              h('span', { className: 'prw-muted' }, `${state.total || state.records.length} ${t('recordsTotal')}`),
            ),
            state.records.length === 0
              ? h('p', { className: 'prw-rail-empty' }, t('emptyRail'))
              : state.records.map((record) => h('button', {
                key: record.id,
                type: 'button',
                className: `prw-item${selected && selected.id === record.id ? ' is-active' : ''}`,
                onClick: () => setSelectedId(record.id),
              },
                h('img', { src: `${API}/image?record=${encodeURIComponent(record.id)}`, alt: '', loading: 'lazy' }),
                h('span', { className: 'prw-item-text' },
                  h('span', { className: 'prw-item-title' }, record.title || '—'),
                  h('span', { className: 'prw-item-sub' },
                    h(StatusDot, { status: record.status }),
                    record.status === 'ready' ? t('statusReady')
                      : record.status === 'analyzing' ? t('statusAnalyzing')
                        : record.status === 'error' ? t('statusError') : t('statusNew'),
                    h('span', { className: 'prw-item-date' }, formatDate(record.createdAt)),
                  ),
                ),
              )),
          ),
          h('main', { className: 'prw-main' },
            selected ? h(RecordView, {
              record: selected,
              t,
              onAnalyze: analyze,
              onDelete: remove,
              onExport: exportRecord,
              onCopyAll: copyAll,
              onUpdated: updateRecord,
              onNotice: notify,
              busy: Boolean(busy),
            }) : h(EmptyState, { t, busy: busy === 'upload', drag, setDrag, onPick: pick, onDrop: dropFiles }),
          ),
        ),
        notice ? h('div', { className: 'prw-toast' }, notice) : null,
      )
    }

    function Icon({ size = 24 }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
      },
        h('rect', { x: 3.2, y: 3.2, width: 17.6, height: 17.6, rx: 4 }),
        h('circle', { cx: 12, cy: 10, r: 2.6 }),
        h('path', { d: 'M7.2 17.2c1.1-1.7 2.7-2.6 4.8-2.6s3.7.9 4.8 2.6' }),
        h('path', { d: 'M8 5.8h8' }),
      )
    }

    function PanelIcon({ size = 16 }) {
      return h(Icon, { size })
    }

    const css = `
.prw-root{height:100%;min-height:0;width:100%;min-width:0;display:flex;flex-direction:column;box-sizing:border-box;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px;padding-top:min(var(--dsh-frame-top-clearance,0px),28px);font-family:var(--ds-font-family,inherit);overflow:hidden}
.prw-root *{box-sizing:border-box}
.prw-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 16px;padding:14px 20px 10px;flex:none;min-width:0}
.prw-brand{display:flex;align-items:center;gap:12px;min-width:0;flex:1 1 240px}
.prw-brand-icon{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-brand-primary)}
.prw-brand h1{font-size:18px;line-height:24px;margin:0;font-weight:600;letter-spacing:.01em}
.prw-brand p{margin:2px 0 0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:16px}
.prw-head-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px;flex:none;min-width:0;max-width:100%}
.prw-vision{display:inline-flex;align-items:center;gap:6px;max-width:100%;padding:4px 9px;border:1px solid var(--dsw-alias-border-l1);border-radius:999px;color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.prw-vision-dot{width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-state-success-primary);flex:none}
.prw-btn{appearance:none;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:8px;padding:6px 12px;font:inherit;font-size:12px;line-height:18px;cursor:pointer;white-space:nowrap;transition:background .12s ease,border-color .12s ease}
.prw-btn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.prw-btn:disabled{opacity:.45;cursor:not-allowed}
.prw-btn-primary{background:var(--dsw-alias-button-primary-fill);border-color:transparent;color:var(--dsw-alias-label-primary-inverted)}
.prw-btn-primary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}
.prw-btn-danger{color:var(--dsw-alias-state-error-primary)}
.prw-btn-sm{padding:4px 9px;font-size:11px;line-height:16px}
.prw-file{display:none}
.prw-error-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 24px 6px;padding:8px 12px;border:1px solid var(--dsw-alias-state-error-primary);border-radius:8px;color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-bg-layer-1);font-size:12px;flex:none}
.prw-body{display:flex;flex:1;min-height:0;min-width:0;border-top:1px solid var(--dsw-alias-border-l1);overflow:hidden}
.prw-rail{width:220px;flex:none;border-right:1px solid var(--dsw-alias-border-l1);overflow:auto;padding:10px;display:flex;flex-direction:column;gap:4px}
.prw-rail-head{display:flex;align-items:center;justify-content:space-between;padding:2px 6px 8px;color:var(--dsw-alias-label-secondary);font-size:11px;letter-spacing:.04em;text-transform:uppercase}
.prw-rail-empty{color:var(--dsw-alias-label-dimmed);font-size:12px;line-height:18px;padding:10px 6px}
.prw-item{display:flex;align-items:center;gap:10px;width:100%;padding:7px;border:none;border-radius:9px;background:transparent;color:inherit;text-align:left;cursor:pointer;font:inherit}
.prw-item:hover{background:var(--dsw-alias-interactive-bg-hover)}
.prw-item.is-active{background:var(--dsw-alias-interactive-bg-hover)}
.prw-item img{width:46px;height:46px;flex:none;object-fit:cover;border-radius:7px;background:var(--dsw-alias-bg-layer-2)}
.prw-item-text{display:flex;flex-direction:column;gap:4px;min-width:0}
.prw-item-title{font-size:12px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.prw-item-sub{display:flex;align-items:center;gap:5px;color:var(--dsw-alias-label-secondary);font-size:10px;line-height:14px;white-space:nowrap}
.prw-item-date{margin-left:auto;color:var(--dsw-alias-label-dimmed)}
.prw-dot{width:6px;height:6px;border-radius:50%;flex:none;background:var(--dsw-alias-state-idle-primary)}
.prw-dot-ready{background:var(--dsw-alias-state-success-primary)}
.prw-dot-analyzing{background:var(--dsw-alias-state-warn-primary);animation:prw-pulse 1.2s ease-in-out infinite}
.prw-dot-error{background:var(--dsw-alias-state-error-primary)}
@keyframes prw-pulse{0%,100%{opacity:.35}50%{opacity:1}}
.prw-main{flex:1;min-width:0;width:100%;max-width:100%;overflow:auto;padding:18px 20px 64px}
.prw-empty{width:100%;max-width:820px;min-width:0;margin:20px auto 0;display:flex;flex-direction:column;gap:16px}
.prw-drop{min-height:280px;border:1px dashed var(--dsw-alias-border-l3);border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:28px;cursor:pointer;background:var(--dsw-alias-bg-layer-1);transition:border-color .15s ease,background .15s ease}
.prw-drop:hover,.prw-drop.is-drag{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-interactive-bg-hover)}
.prw-drop-icon{color:var(--dsw-alias-brand-primary);margin-bottom:6px}
.prw-drop h2{margin:0;font-size:17px;font-weight:600}
.prw-drop p{margin:0;color:var(--dsw-alias-label-secondary);font-size:12px}
.prw-footnote{margin:0;color:var(--dsw-alias-label-dimmed);font-size:11px;text-align:center}
.prw-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px}
.prw-step{display:flex;gap:10px;padding:12px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1)}
.prw-step-num{font-family:var(--ds-font-family-code,monospace);font-size:11px;color:var(--dsw-alias-brand-primary);padding-top:1px}
.prw-step strong{display:block;font-size:12px;line-height:16px}
.prw-step p{margin:3px 0 0;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}
.prw-note{margin:0;padding:10px 12px;border-left:2px solid var(--dsw-alias-state-warn-primary);color:var(--dsw-alias-label-secondary);font-size:11px;line-height:18px;background:var(--dsw-alias-bg-layer-1);border-radius:0 8px 8px 0}
.prw-detail{width:100%;max-width:1080px;min-width:0;margin:0 auto;display:flex;flex-direction:column;gap:14px}
.prw-hero{display:flex;flex-wrap:wrap;gap:18px;align-items:flex-start;padding:16px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1);min-width:0}
.prw-hero-image{width:196px;flex:none;aspect-ratio:3/4;border-radius:10px;overflow:hidden;background:var(--dsw-alias-bg-layer-2)}
.prw-hero-image img{width:100%;height:100%;object-fit:cover;display:block}
.prw-hero-meta{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px}
.prw-hero-title{display:flex;align-items:center;gap:8px;min-width:0}
.prw-hero-title h2{margin:0;font-size:17px;line-height:24px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.prw-status-text{font-size:11px;color:var(--dsw-alias-label-secondary)}
.prw-badges,.prw-chip-row,.prw-locks{display:flex;flex-wrap:wrap;gap:6px}
.prw-chip{display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:10px;line-height:16px;white-space:nowrap}
.prw-chip-ok{border-color:var(--dsw-alias-state-success-primary);color:var(--dsw-alias-state-success-primary)}
.prw-summary{margin:0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:19px}
.prw-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:2px}
.prw-muted{color:var(--dsw-alias-label-dimmed);font-size:11px;line-height:16px}
.prw-hero-hint{margin:0}
.prw-card{border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1);padding:14px 16px;display:flex;flex-direction:column;gap:10px;min-width:0}
.prw-card-head{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:12px}
.prw-card-head h3{margin:0;font-size:13px;line-height:19px;font-weight:600}
.prw-card-hint{margin:2px 0 0;color:var(--dsw-alias-label-dimmed);font-size:11px;line-height:16px;max-width:640px}
.prw-prompt{margin:0;white-space:pre-wrap;word-break:break-word;font-family:var(--ds-font-family-code,ui-monospace,monospace);font-size:11.5px;line-height:1.75;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:10px 11px;max-height:260px;overflow:auto}
.prw-prompt-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;min-width:0}
.prw-prompt-grid>*{min-width:0}
.prw-best{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px;padding:10px 12px;border-left:2px solid var(--dsw-alias-brand-primary);border-radius:0 8px 8px 0;background:var(--dsw-alias-bg-layer-1);font-size:11.5px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.prw-best strong{color:var(--dsw-alias-label-primary);font-weight:600;font-size:12px}
.prw-mobile{border-color:var(--dsw-alias-brand-primary)}
.prw-mobile-input{width:100%;min-height:120px;resize:vertical;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);padding:10px 11px;font:inherit;font-size:12px;line-height:1.7;outline:none}
.prw-mobile-input:focus{border-color:var(--dsw-alias-brand-primary)}
.prw-mobile-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--dsw-alias-label-dimmed);font-size:11px}
.prw-progress{gap:8px}
.prw-progress-bar{height:3px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);overflow:hidden}
.prw-progress-bar span{display:block;height:100%;width:38%;border-radius:999px;background:var(--dsw-alias-brand-primary);animation:prw-slide 1.4s ease-in-out infinite}
@keyframes prw-slide{0%{transform:translateX(-100%)}100%{transform:translateX(320%)}}
.prw-error-box{border-color:var(--dsw-alias-state-error-primary)}
.prw-error-box h3{margin:0;font-size:13px;color:var(--dsw-alias-state-error-primary)}
.prw-error-box p{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);word-break:break-word}
.prw-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}
.prw-metrics-4{grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}
.prw-metric{display:flex;flex-direction:column;gap:3px;padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);min-width:0}
.prw-metric span{color:var(--dsw-alias-label-dimmed);font-size:10px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.prw-metric strong{font-size:13px;line-height:18px;font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.prw-face-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;padding-top:2px}
.prw-label{display:block;color:var(--dsw-alias-label-dimmed);font-size:10px;letter-spacing:.05em;text-transform:uppercase;margin-bottom:4px}
.prw-face-grid p{margin:0 0 3px;font-size:11.5px;line-height:17px;color:var(--dsw-alias-label-secondary)}
.prw-facts{display:flex;flex-direction:column;gap:4px;border-top:1px solid var(--dsw-alias-border-l1);padding-top:10px}
.prw-facts p{margin:0;font-size:11.5px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.prw-facts strong{color:var(--dsw-alias-label-primary);font-weight:500}
.prw-warning{padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-state-warn-label);font-size:11px;line-height:17px}
.prw-form{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}
.prw-field{display:flex;flex-direction:column;gap:4px;min-width:0}
.prw-field span{color:var(--dsw-alias-label-dimmed);font-size:10px;line-height:14px}
.prw-field-wide{grid-column:1/-1}
.prw-textarea{height:auto;min-height:56px;padding:8px;resize:vertical;line-height:1.6}
.prw-input{width:100%;height:30px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);padding:0 8px;font:inherit;font-size:12px;outline:none}
.prw-input:focus{border-color:var(--dsw-alias-brand-primary)}
.prw-two-col{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.prw-two-col h4{margin:0 0 6px;font-size:12px;line-height:17px;font-weight:600}
.prw-list{margin:0;padding-left:16px;display:flex;flex-direction:column;gap:5px;color:var(--dsw-alias-label-secondary);font-size:11.5px;line-height:18px}
.prw-list strong{color:var(--dsw-alias-label-primary);font-weight:500}
.prw-checklist{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;color:var(--dsw-alias-label-secondary);font-size:11.5px;line-height:17px}
.prw-checklist li{position:relative;padding-left:18px}
.prw-checklist li::before{content:"";position:absolute;left:2px;top:4px;width:7px;height:7px;border:1px solid var(--dsw-alias-border-l3);border-radius:2px}
.prw-raw{display:flex;flex-direction:column;gap:8px;border-top:1px solid var(--dsw-alias-border-l1);padding-top:10px}
.prw-link{appearance:none;border:none;background:transparent;color:var(--dsw-alias-brand-primary);font:inherit;font-size:11px;cursor:pointer;padding:0;text-align:left}
.prw-raw-pre{max-height:320px}
.prw-error-inline{color:var(--dsw-alias-state-error-primary);font-size:11px;margin:0}
.prw-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);padding:8px 16px;border-radius:999px;background:var(--dsw-alias-toast-bg);border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);font-size:12px;box-shadow:0 8px 24px rgba(0,0,0,.18);z-index:50}
.prw-status-ready{color:var(--dsw-alias-state-success-primary)}
.prw-status-error{color:var(--dsw-alias-state-error-primary)}
@media (max-width:1100px){.prw-rail{width:190px}.prw-main{padding:16px 16px 56px}.prw-form{grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}}
@media (max-width:820px){.prw-rail{display:none}.prw-hero{flex-direction:column}.prw-hero-image{width:100%;max-width:280px}.prw-two-col{grid-template-columns:minmax(0,1fr)}}
`

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'prompt-reverse locale')
        const register = ctx.slots.register.bind(ctx.slots)
        const mount = ctx.slots.inject.bind(ctx.slots)

        mount('sidebar.panellist', () => register({
          name: 'sidebar.panellist',
          id: 'prompt-reverse',
          order: 9,
          label: () => ctx.locale.bind(NS)('panel'),
        }, PanelIcon))

        mount('main', () => register({
          name: 'main',
          key: 'prompt-reverse',
          inject: () => ({}),
        }, () => h(App, { ctx })))
      },
    }
  },
})

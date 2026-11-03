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
      emptyHint: '支持 PNG / JPEG / WebP / GIF，单张不超过 40MB；上传后自动反推，记录只保存在本机。',
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
      cameraAngle: '机位',
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
      copyMain: '复制主提示词',
      more: '更多操作',
      tabMain: '主提示词',
      tabReference: '参考图编辑',
      tabMobile: '手机版',
      tabNegative: '负向',
      tabSheet: '三视图',
      segZh: '中文',
      segEn: 'EN',
      segQwen: 'Qwen',
      segGeneric: '通用',
      scene: '场景',
      aspect: '画幅',
      heightMethod: '估算方法',
      faceShape: '脸型',
      eyes: '眼睛',
      nose: '鼻子',
      lips: '嘴唇',
      skin: '皮肤',
      hair: '发型',
      marks: '面部标记',
      identitySection: '身份卡',
      reproduceSection: '复现与纠偏',
      componentsSection: '提示词组件',
      viewFull: '查看大图',
      searchRecords: '搜索记录',
      noMatch: '没有匹配的记录',
      chars: '字',
      refHintShort: 'Qwen 用 <image1>；Seedream / Flux / Gemini / 豆包用通用版。',
      mobileHintShort: '不带 <image1>、不带负向词；可直接改字。',
      sheetHintShort: '先生成三视图定稿，再拿它当固定身份参考。',
      close: '关闭',
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
      emptyHint: 'PNG / JPEG / WebP / GIF, up to 40MB. Analysis starts automatically; records stay on this machine.',
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
      cameraAngle: 'Camera angle',
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
      copyMain: 'Copy main prompt',
      more: 'More actions',
      tabMain: 'Main',
      tabReference: 'Reference edit',
      tabMobile: 'Mobile',
      tabNegative: 'Negative',
      tabSheet: 'Character sheet',
      segZh: '中文',
      segEn: 'EN',
      segQwen: 'Qwen',
      segGeneric: 'Generic',
      scene: 'Scene',
      aspect: 'Aspect',
      heightMethod: 'Estimate method',
      faceShape: 'Face shape',
      eyes: 'Eyes',
      nose: 'Nose',
      lips: 'Lips',
      skin: 'Skin',
      hair: 'Hair',
      marks: 'Facial marks',
      identitySection: 'Identity card',
      reproduceSection: 'Reproduce & correct',
      componentsSection: 'Prompt components',
      viewFull: 'View full size',
      searchRecords: 'Search records',
      noMatch: 'No matching records',
      chars: 'chars',
      refHintShort: 'Qwen uses <image1>; Seedream / Flux / Gemini / Doubao use the generic version.',
      mobileHintShort: 'No <image1>, no negative prompt; edit the text directly.',
      sheetHintShort: 'Generate a character sheet first, then reuse it as the fixed identity reference.',
      close: 'Close',
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

    function loadImageFile(blob) {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob)
        const image = new Image()
        image.onload = () => resolve({ image, url })
        image.onerror = () => {
          URL.revokeObjectURL(url)
          reject(new Error('读取图片失败'))
        }
        image.src = url
      })
    }

    function canvasBlob(canvas, type, quality) {
      return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
    }

    async function makeThumb(blob) {
      try {
        const { image, url } = await loadImageFile(blob)
        const longEdge = Math.max(image.naturalWidth, image.naturalHeight)
        const scale = Math.min(1, 128 / longEdge)
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
        URL.revokeObjectURL(url)
        const out = await canvasBlob(canvas, 'image/webp', 0.82)
        return out ? await readFileBase64(out) : ''
      } catch {
        return ''
      }
    }

    async function prepareUpload(file) {
      let blob = file
      let mediaType = guessMediaType(file)
      let name = file.name || 'upload'
      if (mediaType !== 'image/gif' && file.size > 6 * 1024 * 1024) {
        const { image, url } = await loadImageFile(file)
        const longEdge = Math.max(image.naturalWidth, image.naturalHeight)
        const scale = Math.min(1, 4096 / longEdge)
        if (scale < 1) {
          const canvas = document.createElement('canvas')
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
          canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
          const out = await canvasBlob(canvas, 'image/webp', 0.92)
          if (out) {
            blob = out
            mediaType = 'image/webp'
            name = name.replace(/\.[^.]+$/u, '') + '.webp'
          }
        }
        URL.revokeObjectURL(url)
      }
      return {
        data: await readFileBase64(blob),
        mediaType,
        name,
        thumb: await makeThumb(blob),
      }
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

    function CopyButton({ text, t, onNotice, label, variant }) {
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
      const className = variant === 'primary' ? 'prw-btn prw-btn-primary' : 'prw-btn prw-btn-sm'
      return h('button', { type: 'button', className, onClick: copy, disabled: !text }, done ? t('copied') : (label || t('copy')))
    }

    function Seg({ value, options, onChange }) {
      return h('div', { className: 'prw-seg' }, options.map(([key, label]) =>
        h('button', {
          key,
          type: 'button',
          className: `prw-seg-btn${value === key ? ' is-active' : ''}`,
          onClick: () => onChange(key),
        }, label),
      ))
    }

    function PromptBlock({ title, text, t, onNotice }) {
      if (!text) return null
      return h('details', { className: 'prw-block' },
        h('summary', null,
          h('span', { className: 'prw-block-title' }, title),
          h('span', { className: 'prw-block-meta' }, String(text.length)),
        ),
        h('div', { className: 'prw-block-body' },
          h('pre', { className: 'prw-prompt' }, text),
          h('div', { className: 'prw-block-foot' }, h(CopyButton, { text, t, onNotice })),
        ),
      )
    }

    function PromptPanel({ record, prompts, t, onNotice }) {
      const [tab, setTab] = React.useState('main')
      const [lang, setLang] = React.useState('zh')
      const [refMode, setRefMode] = React.useState('qwen')
      const mobileGenerated = prompts.mobile_zh || prompts.compact_zh || prompts.full_zh || ''
      const [mobileText, setMobileText] = React.useState(mobileGenerated)

      React.useEffect(() => {
        setTab('main')
        setLang('zh')
        setRefMode('qwen')
      }, [record.id])
      React.useEffect(() => { setMobileText(mobileGenerated) }, [record.id, record.updatedAt])

      const tabs = [
        ['main', t('tabMain')],
        ['reference', t('tabReference')],
        ['mobile', t('tabMobile')],
        ['negative', t('tabNegative')],
        prompts.identity_sheet_zh ? ['sheet', t('tabSheet')] : null,
      ].filter(Boolean)

      const activeTab = tabs.some(([key]) => key === tab) ? tab : 'main'
      const generic = prompts.reference_edit_generic_zh || ''
      const text = activeTab === 'main'
        ? (lang === 'en' ? prompts.full_en : prompts.full_zh)
        : activeTab === 'negative'
          ? (lang === 'en' ? prompts.negative_en : prompts.negative_zh)
          : activeTab === 'reference'
            ? (refMode === 'generic' ? generic : prompts.reference_edit_zh)
            : activeTab === 'sheet'
              ? prompts.identity_sheet_zh
              : ''
      const isEn = (activeTab === 'main' || activeTab === 'negative') && lang === 'en'
      const hint = activeTab === 'reference'
        ? t('refHintShort')
        : activeTab === 'mobile'
          ? t('mobileHintShort')
          : activeTab === 'sheet'
            ? t('sheetHintShort')
            : ''

      return h('section', { className: 'prw-panel' },
        h('div', { className: 'prw-tabs' }, tabs.map(([key, label]) =>
          h('button', {
            key,
            type: 'button',
            className: `prw-tab${activeTab === key ? ' is-active' : ''}`,
            onClick: () => setTab(key),
          }, label),
        )),
        h('div', { className: 'prw-panel-bar' },
          h('div', { className: 'prw-panel-controls' },
            (activeTab === 'main' || activeTab === 'negative')
              ? h(Seg, { value: lang, onChange: setLang, options: [['zh', t('segZh')], ['en', t('segEn')]] })
              : null,
            activeTab === 'reference'
              ? h(Seg, {
                value: refMode,
                onChange: setRefMode,
                options: [['qwen', t('segQwen')], ...(generic ? [['generic', t('segGeneric')]] : [])],
              })
              : null,
            h('span', { className: 'prw-panel-count' },
              activeTab === 'mobile' ? `${mobileText.length} ${t('chars')}` : (text ? `${text.length} ${t('chars')}` : '')),
          ),
          h('div', { className: 'prw-panel-actions' },
            activeTab === 'mobile'
              ? h('button', { type: 'button', className: 'prw-link', onClick: () => setMobileText(mobileGenerated) }, t('resetMobile'))
              : null,
            h(CopyButton, {
              text: activeTab === 'mobile' ? mobileText : text,
              t,
              onNotice,
              label: activeTab === 'mobile' ? t('copyMobile') : undefined,
            }),
          ),
        ),
        activeTab === 'mobile'
          ? h('textarea', {
            className: 'prw-mobile-input',
            value: mobileText,
            rows: 7,
            spellCheck: false,
            onChange: (event) => setMobileText(event.target.value),
          })
          : h('pre', { className: `prw-prompt${isEn ? ' is-en' : ''}` }, text || t('noPrompts')),
        hint ? h('p', { className: 'prw-panel-hint' }, hint) : null,
      )
    }

    function StatusDot({ status }) {
      return h('span', { className: `prw-dot prw-dot-${status || 'new'}`, 'aria-hidden': true })
    }

    function statusText(t, status) {
      return status === 'ready' ? t('statusReady')
        : status === 'analyzing' ? t('statusAnalyzing')
          : status === 'error' ? t('statusError') : t('statusNew')
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
          h('span', { className: 'prw-drop-icon' }, h(Icon, { size: 36 })),
          h('h2', null, busy ? t('uploading') : t('emptyTitle')),
          h('p', null, t('drop')),
          h('p', { className: 'prw-muted' }, t('paste')),
        ),
        h('p', { className: 'prw-flow' }, `${t('step1')} · ${t('step2')} · ${t('step3')}`),
        h('p', { className: 'prw-footnote' }, t('emptyHint')),
      )
    }

    function Stat({ label, value: metricValue, suffix }) {
      return h('div', { className: 'prw-stat' },
        h('span', null, label),
        h('strong', null, value(metricValue, suffix || '')),
      )
    }

    function CorrectionForm({ record, t, onUpdated, onNotice }) {
      const analysis = record.analysis || {}
      const overrides = record.overrides || {}
      const [draft, setDraft] = React.useState(() => ({
        title: record.title || '',
        height: overrides.height_cm !== undefined ? overrides.height_cm : (analysis.body?.height_cm ?? ''),
        head: overrides.head_units !== undefined ? overrides.head_units : (analysis.body?.head_units ?? ''),
        age: overrides.age_range !== undefined ? overrides.age_range : (analysis.age_range ?? ''),
        gender: overrides.gender !== undefined ? overrides.gender : (analysis.gender ?? 'unknown'),
        anatomyNote: overrides.anatomy_note ?? '',
      }))
      const [saving, setSaving] = React.useState(false)

      React.useEffect(() => {
        const current = record.overrides || {}
        const data = record.analysis || {}
        setDraft({
          title: record.title || '',
          height: current.height_cm !== undefined ? current.height_cm : (data.body?.height_cm ?? ''),
          head: current.head_units !== undefined ? current.head_units : (data.body?.head_units ?? ''),
          age: current.age_range !== undefined ? current.age_range : (data.age_range ?? ''),
          gender: current.gender !== undefined ? current.gender : (data.gender ?? 'unknown'),
          anatomyNote: current.anatomy_note ?? '',
        })
      }, [record.id, record.updatedAt])

      const update = (key) => (event) => setDraft((prev) => ({ ...prev, [key]: event.target.value }))

      const save = async () => {
        setSaving(true)
        try {
          const current = record.overrides || {}
          const data = record.analysis || {}
          const currentHeight = current.height_cm !== undefined ? current.height_cm : (data.body?.height_cm ?? '')
          const currentHead = current.head_units !== undefined ? current.head_units : (data.body?.head_units ?? '')
          const currentAge = current.age_range !== undefined ? current.age_range : (data.age_range ?? '')
          const currentGender = current.gender !== undefined ? current.gender : (data.gender ?? 'unknown')
          const payload = { id: record.id, overrides: {} }
          if (String(draft.height) !== String(currentHeight)) payload.overrides.height_cm = draft.height === '' ? null : Number(draft.height)
          if (String(draft.head) !== String(currentHead)) payload.overrides.head_units = draft.head === '' ? null : Number(draft.head)
          if (draft.age !== currentAge) payload.overrides.age_range = draft.age
          if (draft.gender !== currentGender) payload.overrides.gender = draft.gender
          if (draft.anatomyNote !== (current.anatomy_note || '')) payload.overrides.anatomy_note = draft.anatomyNote
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

      return h('div', { className: 'prw-form-wrap' },
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
        h('div', { className: 'prw-form-foot' },
          h('p', { className: 'prw-muted' }, t('correctionHint')),
          h('button', { type: 'button', className: 'prw-btn prw-btn-primary prw-btn-sm', onClick: save, disabled: saving },
            saving ? t('saving') : t('save')),
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
          const out = await api(`record?id=${encodeURIComponent(record.id)}&include_raw=1`)
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

    function RecordView({ record, t, onAnalyze, onDelete, onExport, onCopyAll, onUpdated, onNotice, busy }) {
      const analysis = record.analysis || {}
      const prompts = record.prompts || null
      const params = record.params || null
      const overrides = record.overrides || {}
      const body = analysis.body || {}
      const proportions = analysis.proportions || {}
      const face = analysis.face || {}
      const technical = analysis.technical || {}
      const [viewer, setViewer] = React.useState(false)
      const [menu, setMenu] = React.useState(false)

      React.useEffect(() => { setMenu(false); setViewer(false) }, [record.id])
      React.useEffect(() => {
        if (!viewer) return undefined
        const onKey = (event) => { if (event.key === 'Escape') setViewer(false) }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
      }, [viewer])

      const effectiveHeight = overrides.height_cm !== undefined ? overrides.height_cm : body.height_cm
      const effectiveHead = overrides.head_units !== undefined ? overrides.head_units : body.head_units
      const effectiveAge = overrides.age_range !== undefined ? overrides.age_range : analysis.age_range
      const effectiveGender = overrides.gender !== undefined ? overrides.gender : analysis.gender
      const genderLabel = effectiveGender === 'female' ? t('genderFemale')
        : effectiveGender === 'male' ? t('genderMale')
          : effectiveGender === 'androgynous' ? t('genderAndrogynous') : t('genderUnknown')
      const genderMeta = effectiveGender && effectiveGender !== 'unknown' ? genderLabel : ''
      const analyzing = record.status === 'analyzing'
      const showResult = Boolean(prompts) && !analyzing
      const imageUrl = `${API}/image?record=${encodeURIComponent(record.id)}`

      const metricCandidates = [
        [t('headUnits'), effectiveHead],
        [t('faceRatio'), proportions.face_width_height_ratio],
        [t('waistHip'), proportions.waist_hip_ratio],
        [t('legBody'), proportions.leg_body_ratio],
        [t('height'), effectiveHeight, ' cm'],
        [t('shoulderHead'), body.shoulder_width_head_units],
        [t('ipd'), proportions.interpupillary_face_ratio],
        [t('noseRatio'), proportions.nose_width_face_ratio],
        [t('mouthRatio'), proportions.mouth_width_face_ratio],
        [t('shoulderHip'), proportions.shoulder_hip_ratio],
        [t('bodyFat'), body.body_fat_percent, '%'],
      ].filter(([, metricValue]) => metricValue !== null && metricValue !== undefined && metricValue !== '')
      const primaryMetrics = metricCandidates.slice(0, 4)

      const faceRows = [
        [t('faceShape'), face.face_shape_zh],
        [t('eyes'), face.eyes_zh],
        [t('nose'), face.nose_zh],
        [t('lips'), face.lips_zh],
        [t('skin'), face.skin_zh],
        [t('hair'), face.hair_zh],
        [t('marks'), face.marks_zh],
        [t('facialHair'), face.facial_hair_zh],
        [t('moles'), face.moles_zh],
        [t('scars'), face.scars_zh],
        [t('freckles'), face.freckles_zh],
        [t('birthmarks'), face.birthmarks_zh],
        [t('piercings'), face.piercings_zh],
        [t('tattoos'), face.tattoos_zh],
        [t('makeup'), face.makeup_zh],
        [t('teeth'), face.teeth_zh],
        [t('gaze'), face.gaze_zh],
        [t('skinDetails'), face.skin_details_zh],
        [t('expressionHint'), face.expression_zh],
      ].filter(([, rowValue]) => rowValue)

      const bodyRows = [
        [t('height'), effectiveHeight ? `${effectiveHeight} cm` : ''],
        [t('heightRange'), Array.isArray(body.height_range_cm) && body.height_range_cm.length === 2 ? `${body.height_range_cm[0]}–${body.height_range_cm[1]} cm` : ''],
        [t('headUnits'), effectiveHead],
        [t('shoulderHead'), body.shoulder_width_head_units],
        [t('bodyFat'), body.body_fat_percent ? `${body.body_fat_percent}%` : ''],
        [t('heightMethod'), body.height_method_zh],
      ].filter(([, rowValue]) => rowValue)

      const sceneRows = [
        [t('ethnicity'), [analysis.ethnicity_zh, analysis.face_structure_zh].filter(Boolean).join('；')],
        [t('wardrobe'), analysis.wardrobe_zh],
        [t('scene'), analysis.scene_zh],
        [t('cameraAngle'), analysis.camera_zh],
        [t('lighting'), analysis.lighting_zh],
        [t('style'), analysis.style_zh],
      ].filter(([, rowValue]) => rowValue)

      const techRows = [
        [t('medium'), technical.medium_zh],
        [t('camera'), technical.camera_zh],
        [t('lens'), technical.lens_zh],
        [t('aperture'), technical.aperture],
        [t('iso'), technical.iso],
        [t('shutter'), technical.shutter],
        [t('focal'), technical.focal_length_mm],
        [t('grain'), technical.grain_zh],
        [t('skinTexture'), technical.skin_texture_zh],
        [t('colorGrade'), technical.color_grade_zh],
        [t('dof'), technical.depth_of_field_zh],
        [t('quality'), technical.quality_zh],
      ].filter(([, rowValue]) => rowValue !== null && rowValue !== undefined && rowValue !== '')

      const paramBits = []
      if (params) {
        if (params.width && params.height) paramBits.push(`${params.width}×${params.height}`)
        if (params.aspect_ratio) paramBits.push(params.aspect_ratio)
        if (params.steps) paramBits.push(`steps ${params.steps}`)
        if (params.guidance) paramBits.push(`guidance ${params.guidance}`)
        if (params.seed) paramBits.push(`seed ${params.seed}`)
      }

      const components = [
        [t('identityZh'), prompts && prompts.identity_zh],
        [t('identityEn'), prompts && prompts.identity_en],
        [t('faceDetails'), prompts && prompts.face_details_zh],
        [t('expressionHint'), prompts && prompts.expression_hint_zh],
        [t('qualityLock'), prompts && prompts.quality_lock_zh],
        [t('anatomyPrompt'), prompts && prompts.anatomy_prompt_zh],
        [t('compact'), prompts && prompts.compact_zh],
      ].filter(([, text]) => text)

      const kv = (label, rowValue) => rowValue
        ? h('div', { className: 'prw-kv', key: label }, h('span', null, label), h('p', null, value(rowValue)))
        : null
      const kvGroup = (label, rows) => rows.length
        ? h('div', { className: 'prw-kv-group', key: label },
          h('h4', null, label),
          h('div', { className: 'prw-kv-grid' }, rows.map(([rowLabel, rowValue]) => kv(rowLabel, rowValue))))
        : null

      return h('div', { className: 'prw-detail' },
        h('section', { className: 'prw-hero' },
          h('div', { className: 'prw-hero-media' },
            h('button', {
              type: 'button',
              className: 'prw-hero-image',
              onClick: () => setViewer(true),
              title: t('viewFull'),
            }, h('img', { src: imageUrl, alt: t('imageAlt') })),
            record.image ? h('span', { className: 'prw-image-cap' }, `${record.image.width}×${record.image.height}`) : null,
          ),
          h('div', { className: 'prw-hero-meta' },
            h('div', { className: 'prw-hero-title' },
              h('h2', null, record.title || '—'),
              h('span', { className: `prw-status-pill prw-status-${record.status}` },
                h(StatusDot, { status: record.status }),
                statusText(t, record.status),
              ),
            ),
            (effectiveAge || genderMeta)
              ? h('p', { className: 'prw-hero-sub' }, [effectiveAge, genderMeta].filter(Boolean).join(' · '))
              : null,
            analysis.summary_zh ? h('p', { className: 'prw-summary' }, analysis.summary_zh) : null,
            h('div', { className: 'prw-actions' },
              record.status === 'ready' && prompts && prompts.full_zh
                ? h(CopyButton, {
                  text: prompts.full_zh,
                  t,
                  onNotice,
                  label: t('copyMain'),
                  variant: 'primary',
                })
                : h('button', {
                  type: 'button',
                  className: 'prw-btn prw-btn-primary',
                  onClick: () => onAnalyze(record),
                  disabled: busy || analyzing,
                }, analyzing ? t('statusAnalyzing') : (record.status === 'error' ? t('retry') : t('analyze'))),
              h('div', { className: 'prw-menu-wrap' },
                h('button', {
                  type: 'button',
                  className: 'prw-btn prw-icon-btn',
                  'aria-label': t('more'),
                  onClick: () => setMenu((open) => !open),
                }, '⋯'),
                menu ? h('div', { className: 'prw-menu' },
                  h('button', {
                    type: 'button',
                    disabled: !prompts,
                    onClick: () => { setMenu(false); onCopyAll(record) },
                  }, t('copyAll')),
                  h('button', {
                    type: 'button',
                    disabled: !record.analysis,
                    onClick: () => { setMenu(false); onExport(record) },
                  }, t('export')),
                  h('button', {
                    type: 'button',
                    disabled: busy || analyzing,
                    onClick: () => { setMenu(false); onAnalyze(record) },
                  }, t('retry')),
                  h('button', {
                    type: 'button',
                    className: 'is-danger',
                    disabled: busy,
                    onClick: () => { setMenu(false); onDelete(record) },
                  }, t('delete')),
                ) : null,
              ),
            ),
          ),
        ),

        showResult && analysis.warnings_zh && analysis.warnings_zh.length
          ? h('div', { className: 'prw-warning-strip' }, analysis.warnings_zh.join(' · '))
          : null,

        analyzing ? h('section', { className: 'prw-progress' },
          h('div', { className: 'prw-progress-bar' }, h('span', null)),
          h('p', null, t('analyzingHint')),
          record.provider ? h('p', { className: 'prw-muted' }, `${t('model')}: ${record.provider}/${record.model}`) : null,
        ) : null,

        record.status === 'error' ? h('section', { className: 'prw-error-box' },
          h('h3', null, t('errorTitle')),
          h('p', null, record.error || '—'),
          h('p', { className: 'prw-muted' }, t('retryHint')),
        ) : null,

        showResult && primaryMetrics.length
          ? h('div', { className: 'prw-metrics-primary' },
            primaryMetrics.map(([label, metricValue, suffix], index) =>
              h(Stat, { key: `${label}-${index}`, label, value: metricValue, suffix })))
          : null,

        showResult && prompts ? h(PromptPanel, { record, prompts, t, onNotice }) : null,

        showResult && components.length
          ? h('details', { className: 'prw-section' },
            h('summary', null, t('componentsSection')),
            h('div', { className: 'prw-section-body prw-blocks' },
              components.map(([label, text]) => h(PromptBlock, { key: label, title: label, text, t, onNotice }))),
          )
          : null,

        showResult ? h('details', { className: 'prw-section' },
          h('summary', null,
            t('identitySection'),
            (effectiveAge || genderLabel) ? h('span', { className: 'prw-summary-meta' }, [effectiveAge, genderLabel].filter(Boolean).join(' · ')) : null,
          ),
          h('div', { className: 'prw-section-body' },
            faceRows.length ? kvGroup(t('face'), faceRows) : null,
            bodyRows.length || analysis.body_zh
              ? h('div', { className: 'prw-kv-group' },
                h('h4', null, t('body')),
                analysis.body_zh ? h('p', { className: 'prw-paragraph' }, analysis.body_zh) : null,
                h('div', { className: 'prw-kv-grid' }, bodyRows.map(([rowLabel, rowValue]) => kv(rowLabel, rowValue))))
              : null,
            sceneRows.length ? kvGroup(t('scene'), sceneRows) : null,
            prompts && prompts.locks_zh && prompts.locks_zh.length
              ? h('div', { className: 'prw-kv-group' },
                h('h4', null, t('locks')),
                h('div', { className: 'prw-chips' }, prompts.locks_zh.map((lock, index) => h(Chip, { key: index }, lock))))
              : null,
          ),
        ) : null,

        showResult && record.analysis ? h('details', { className: 'prw-section' },
          h('summary', null, t('correction')),
          h('div', { className: 'prw-section-body' },
            h(CorrectionForm, { record, t, onUpdated, onNotice })),
        ) : null,

        showResult && prompts && ((prompts.rules_zh && prompts.rules_zh.length) || (prompts.drift_fixes && prompts.drift_fixes.length))
          ? h('details', { className: 'prw-section' },
            h('summary', null, t('reproduceSection')),
            h('div', { className: 'prw-section-body prw-two-col' },
              h('div', null,
                h('h4', null, t('rules')),
                h('ul', { className: 'prw-list' }, (prompts.rules_zh || []).map((rule, index) => h('li', { key: index }, rule)))),
              h('div', null,
                h('h4', null, t('drift')),
                h('ul', { className: 'prw-list' }, (prompts.drift_fixes || []).map((item, index) => h('li', { key: index },
                  h('strong', null, `${item.symptom}：`), item.fix)))),
            ),
          )
          : null,

        showResult ? h('details', { className: 'prw-section' },
          h('summary', null, t('technical')),
          h('div', { className: 'prw-section-body' },
            techRows.length ? h('div', { className: 'prw-kv-grid' }, techRows.map(([label, rowValue]) => kv(label, rowValue))) : null,
            paramBits.length ? h('p', { className: 'prw-muted' }, paramBits.join(' · ')) : null,
            h(RawView, { record, t })),
        ) : null,

        viewer ? h('div', {
          className: 'prw-lightbox',
          role: 'dialog',
          'aria-modal': 'true',
          onClick: () => setViewer(false),
        },
          h('img', { src: imageUrl, alt: t('imageAlt') }),
          h('button', {
            type: 'button',
            className: 'prw-lightbox-close',
            onClick: () => setViewer(false),
            'aria-label': t('close'),
          }, '×'),
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
      const [query, setQuery] = React.useState('')
      const inputRef = React.useRef(null)

      const refresh = React.useCallback(async (id) => {
        try {
          const suffix = id ? `?selected=${encodeURIComponent(id)}` : ''
          const next = await api(`state${suffix}`)
          setState(next)
          if (!id && next.selected && next.selected.id) setSelectedId(next.selected.id)
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
        const timer = window.setInterval(() => { void refresh(selectedId) }, 1800)
        return () => window.clearInterval(timer)
      }, [hasAnalyzing, refresh, selectedId])

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
          const prepared = await prepareUpload(file)
          const out = await post('upload', prepared)
          setSelectedId(out.record.id)
          await refresh(out.record.id)
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

      const selected = state.selected || null
      const needle = query.trim().toLowerCase()
      const visibleRecords = needle
        ? state.records.filter((record) => String(record.title || '').toLowerCase().includes(needle))
        : state.records

      const pick = () => inputRef.current && inputRef.current.click()

      const dropFiles = (files) => {
        if (files && files.length) void uploadFile(files[0])
      }

      const analyze = async (record) => {
        setBusy('analyze')
        setError('')
        try {
          await post('analyze', { id: record.id })
          await refresh(record.id)
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
          selected: prev.selected && prev.selected.id === next.id ? next : prev.selected,
          records: prev.records.map((record) => (record.id === next.id ? next : record)),
        }))
      }

      const selectRecord = (id) => {
        setSelectedId(id)
        void refresh(id)
      }

      const vision = state.vision
      const visionText = vision ? `${vision.model}${vision.effort ? ` · ${vision.effort}` : ''}` : t('notRun')
      const visionTitle = vision ? `${vision.provider}/${vision.model}` : t('model')

      return h('div', {
        className: 'prw-root',
        onDragOver: (event) => { event.preventDefault(); setDrag(true) },
        onDragLeave: () => setDrag(false),
        onDrop: (event) => { event.preventDefault(); setDrag(false); dropFiles(event.dataTransfer.files) },
      },
        h('style', null, css),
        h('header', { className: 'prw-head' },
          h('div', { className: 'prw-brand' },
            h('span', { className: 'prw-brand-icon' }, h(Icon, { size: 26 })),
            h('h1', null, t('title')),
          ),
          h('div', { className: 'prw-head-actions' },
            state.records.length
              ? h('select', {
                className: 'prw-record-select',
                value: selected ? selected.id : '',
                onChange: (event) => selectRecord(event.target.value),
                'aria-label': t('records'),
              }, state.records.map((record) => h('option', { key: record.id, value: record.id }, record.title || '—')))
              : null,
            vision ? h('span', { className: 'prw-vision', title: visionTitle },
              h('span', { className: 'prw-vision-dot' }),
              h('span', null, visionText),
            ) : null,
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
              h('span', { className: 'prw-rail-count' }, String(state.total || state.records.length)),
            ),
            h('input', {
              className: 'prw-search',
              value: query,
              placeholder: t('searchRecords'),
              'aria-label': t('searchRecords'),
              onChange: (event) => setQuery(event.target.value),
            }),
            state.records.length === 0
              ? h('p', { className: 'prw-rail-empty' }, t('emptyRail'))
              : visibleRecords.length === 0
                ? h('p', { className: 'prw-rail-empty' }, t('noMatch'))
                : visibleRecords.map((record) => h('button', {
                  key: record.id,
                  type: 'button',
                  className: `prw-item${selected && selected.id === record.id ? ' is-active' : ''}`,
                  title: `${statusText(t, record.status)} · ${formatDate(record.createdAt)}`,
                  onClick: () => selectRecord(record.id),
                },
                  h('img', { src: `${API}/image?record=${encodeURIComponent(record.id)}&thumb=1`, alt: '', loading: 'lazy' }),
                  h('span', { className: 'prw-item-text' },
                    h('span', { className: 'prw-item-title' }, record.title || '—'),
                    h('span', { className: 'prw-item-sub' },
                      h(StatusDot, { status: record.status }),
                      statusText(t, record.status),
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
.prw-root{height:100%;min-height:0;width:100%;min-width:0;display:flex;flex-direction:column;box-sizing:border-box;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:14px;padding-top:min(var(--dsh-frame-top-clearance,0px),28px);font-family:var(--ds-font-family,inherit);overflow:hidden}
.prw-root *{box-sizing:border-box}
.prw-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 12px;padding:10px 20px;flex:none;min-width:0}
.prw-brand{display:flex;align-items:center;gap:9px;min-width:0;flex:1 1 auto}
.prw-brand-icon{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;color:var(--dsw-alias-brand-primary);flex:none}
.prw-brand h1{font-size:15px;line-height:22px;margin:0;font-weight:600;letter-spacing:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.prw-head-actions{display:flex;align-items:center;gap:8px;min-width:0;flex:none;max-width:100%}
.prw-vision{display:inline-flex;align-items:center;gap:6px;max-width:220px;padding:3px 8px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.prw-vision-dot{width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-state-success-primary);flex:none}
.prw-record-select{display:none;height:28px;max-width:180px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;padding:0 8px}
.prw-btn{appearance:none;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:8px;padding:6px 12px;font:inherit;font-size:12px;line-height:18px;cursor:pointer;white-space:nowrap;transition:background .12s ease,border-color .12s ease}
.prw-btn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.prw-btn:disabled{opacity:.45;cursor:not-allowed}
.prw-btn-primary{background:var(--dsw-alias-button-primary-fill);border-color:transparent;color:var(--dsw-alias-label-primary-inverted)}
.prw-btn-primary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}
.prw-btn-sm{padding:4px 9px;font-size:11px;line-height:16px}
.prw-icon-btn{padding:6px 10px;font-size:14px;line-height:16px;color:var(--dsw-alias-label-secondary)}
.prw-file{display:none}
.prw-error-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 20px 6px;padding:8px 12px;border:1px solid var(--dsw-alias-state-error-primary);border-radius:8px;color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-bg-layer-1);font-size:12px;flex:none}
.prw-body{display:flex;flex:1;min-height:0;min-width:0;border-top:1px solid var(--dsw-alias-border-l1);overflow:hidden}
.prw-rail{width:236px;flex:none;border-right:1px solid var(--dsw-alias-border-l1);overflow:auto;padding:8px;display:flex;flex-direction:column;gap:2px}
.prw-rail-head{display:flex;align-items:center;justify-content:space-between;padding:4px 6px 2px;color:var(--dsw-alias-label-secondary);font-size:11px}
.prw-rail-count{font-size:10px;color:var(--dsw-alias-label-dimmed);font-variant-numeric:tabular-nums}
.prw-search{width:100%;height:28px;margin:4px 0 6px;border:1px solid transparent;border-radius:7px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);padding:0 9px;font:inherit;font-size:12px;outline:none}
.prw-search:focus{border-color:var(--dsw-alias-brand-primary)}
.prw-search::placeholder{color:var(--dsw-alias-label-dimmed)}
.prw-rail-empty{color:var(--dsw-alias-label-dimmed);font-size:12px;line-height:18px;padding:10px 6px;margin:0}
.prw-item{display:flex;align-items:center;gap:9px;width:100%;padding:6px;border:none;border-radius:8px;background:transparent;color:inherit;text-align:left;cursor:pointer;font:inherit;min-width:0}
.prw-item:hover{background:var(--dsw-alias-interactive-bg-hover)}
.prw-item.is-active{background:var(--dsw-alias-bg-layer-2)}
.prw-item img{width:40px;height:40px;flex:none;object-fit:cover;border-radius:6px;background:var(--dsw-alias-bg-layer-2)}
.prw-item-text{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}
.prw-item-title{font-size:12px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.prw-item-sub{display:flex;align-items:center;gap:5px;color:var(--dsw-alias-label-secondary);font-size:10px;line-height:14px;white-space:nowrap}
.prw-dot{width:6px;height:6px;border-radius:50%;flex:none;background:var(--dsw-alias-state-idle-primary)}
.prw-dot-ready{background:var(--dsw-alias-state-success-primary)}
.prw-dot-analyzing{background:var(--dsw-alias-state-warn-primary);animation:prw-pulse 1.2s ease-in-out infinite}
.prw-dot-error{background:var(--dsw-alias-state-error-primary)}
@keyframes prw-pulse{0%,100%{opacity:.35}50%{opacity:1}}
.prw-main{flex:1;min-width:0;width:100%;max-width:100%;overflow:auto;padding:18px 20px 64px}
.prw-empty{width:100%;max-width:520px;min-width:0;margin:48px auto 0;display:flex;flex-direction:column;gap:12px;align-items:center;text-align:center}
.prw-drop{width:100%;min-height:240px;border:1px dashed var(--dsw-alias-border-l3);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:24px;cursor:pointer;background:var(--dsw-alias-bg-layer-1);transition:border-color .15s ease,background .15s ease}
.prw-drop:hover,.prw-drop.is-drag{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-interactive-bg-hover)}
.prw-drop-icon{color:var(--dsw-alias-brand-primary);margin-bottom:4px;display:inline-flex}
.prw-drop h2{margin:0;font-size:16px;font-weight:600}
.prw-drop p{margin:0;color:var(--dsw-alias-label-secondary);font-size:12px}
.prw-flow{margin:2px 0 0;color:var(--dsw-alias-label-secondary);font-size:11px;letter-spacing:.02em}
.prw-footnote{margin:0;color:var(--dsw-alias-label-dimmed);font-size:11px;line-height:17px;max-width:420px}
.prw-detail{width:100%;max-width:920px;min-width:0;margin:0 auto;display:flex;flex-direction:column;gap:16px}
.prw-hero{display:grid;grid-template-columns:172px minmax(0,1fr);gap:18px;align-items:start;min-width:0}
.prw-hero-media{display:flex;flex-direction:column;gap:6px;min-width:0}
.prw-hero-image{display:block;width:100%;aspect-ratio:3/4;padding:0;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;overflow:hidden;background:var(--dsw-alias-bg-layer-2);cursor:zoom-in}
.prw-hero-image img{width:100%;height:100%;object-fit:contain;display:block}
.prw-image-cap{font-size:10px;line-height:14px;color:var(--dsw-alias-label-dimmed);text-align:center;font-variant-numeric:tabular-nums}
.prw-hero-meta{display:flex;flex-direction:column;gap:8px;min-width:0;padding-top:2px}
.prw-hero-title{display:flex;align-items:center;gap:9px;min-width:0;flex-wrap:wrap}
.prw-hero-title h2{margin:0;font-size:18px;line-height:26px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.prw-status-pill{display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:10.5px;line-height:16px;white-space:nowrap}
.prw-status-pill.prw-status-ready{color:var(--dsw-alias-state-success-primary)}
.prw-status-pill.prw-status-error{color:var(--dsw-alias-state-error-primary)}
.prw-status-pill.prw-status-analyzing{color:var(--dsw-alias-state-warn-label)}
.prw-hero-sub{margin:0;font-size:11.5px;line-height:16px;color:var(--dsw-alias-label-dimmed)}
.prw-summary{margin:0;color:var(--dsw-alias-label-secondary);font-size:12.5px;line-height:19px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.prw-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:2px}
.prw-menu-wrap{position:relative}
.prw-menu{position:absolute;right:0;top:calc(100% + 6px);min-width:150px;display:flex;flex-direction:column;padding:4px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 10px 28px rgba(0,0,0,.18);z-index:30}
.prw-menu button{appearance:none;border:none;background:transparent;color:var(--dsw-alias-label-primary);text-align:left;padding:7px 9px;border-radius:6px;font:inherit;font-size:12px;line-height:17px;cursor:pointer;white-space:nowrap}
.prw-menu button:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2)}
.prw-menu button:disabled{opacity:.4;cursor:not-allowed}
.prw-menu button.is-danger{color:var(--dsw-alias-state-error-primary)}
.prw-warning-strip{padding:8px 10px;border-left:2px solid var(--dsw-alias-state-warn-primary);border-radius:0 8px 8px 0;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-state-warn-label);font-size:11.5px;line-height:17px}
.prw-progress{border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1);padding:10px 12px;display:flex;flex-direction:column;gap:8px}
.prw-progress p{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.prw-progress-bar{height:3px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);overflow:hidden}
.prw-progress-bar span{display:block;height:100%;width:38%;border-radius:999px;background:var(--dsw-alias-brand-primary);animation:prw-slide 1.4s ease-in-out infinite}
@keyframes prw-slide{0%{transform:translateX(-100%)}100%{transform:translateX(320%)}}
.prw-error-box{border:1px solid var(--dsw-alias-state-error-primary);border-radius:10px;background:var(--dsw-alias-bg-layer-1);padding:10px 12px;display:flex;flex-direction:column;gap:5px}
.prw-error-box h3{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-state-error-primary)}
.prw-error-box p{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);word-break:break-word}
.prw-metrics-primary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;overflow:hidden;background:var(--dsw-alias-border-l1)}
.prw-stat{display:flex;flex-direction:column;gap:2px;padding:9px 12px;background:var(--dsw-alias-bg-layer-1);min-width:0}
.prw-stat span{color:var(--dsw-alias-label-dimmed);font-size:10.5px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.prw-stat strong{font-size:17px;line-height:23px;font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.prw-panel{border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1);padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0}
.prw-tabs{display:flex;gap:2px;padding:2px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);width:fit-content;max-width:100%;overflow-x:auto}
.prw-tab{appearance:none;border:none;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:17px;padding:5px 10px;border-radius:6px;cursor:pointer;white-space:nowrap}
.prw-tab:hover{color:var(--dsw-alias-label-primary)}
.prw-tab.is-active{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,.08)}
.prw-panel-bar{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:26px;flex-wrap:wrap}
.prw-panel-controls{display:flex;align-items:center;gap:8px;min-width:0}
.prw-panel-actions{display:flex;align-items:center;gap:8px;margin-left:auto}
.prw-seg{display:flex;gap:2px;padding:2px;border-radius:7px;background:var(--dsw-alias-bg-layer-2)}
.prw-seg-btn{appearance:none;border:none;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;line-height:15px;padding:3px 8px;border-radius:5px;cursor:pointer;white-space:nowrap}
.prw-seg-btn.is-active{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-weight:600}
.prw-panel-count{font-size:10.5px;line-height:14px;color:var(--dsw-alias-label-dimmed);font-variant-numeric:tabular-nums;white-space:nowrap}
.prw-prompt{margin:0;white-space:pre-wrap;word-break:break-word;font-family:var(--ds-font-family,inherit);font-size:13px;line-height:1.75;color:var(--dsw-alias-label-primary)}
.prw-prompt.is-en{font-family:var(--ds-font-family-code,ui-monospace,monospace);font-size:12px;line-height:1.7}
.prw-mobile-input{width:100%;min-height:150px;resize:vertical;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);padding:10px;font:inherit;font-size:12.5px;line-height:1.7;outline:none}
.prw-mobile-input:focus{border-color:var(--dsw-alias-brand-primary)}
.prw-panel-hint{margin:0;font-size:10.5px;line-height:16px;color:var(--dsw-alias-label-dimmed)}
.prw-section{border-top:1px solid var(--dsw-alias-border-l1);min-width:0}
.prw-section > summary{display:flex;align-items:center;gap:6px;padding:11px 2px;cursor:pointer;font-size:12px;line-height:17px;font-weight:600;color:var(--dsw-alias-label-primary);list-style:none;user-select:none}
.prw-section > summary::-webkit-details-marker{display:none}
.prw-section > summary::after{content:"+";margin-left:auto;color:var(--dsw-alias-label-dimmed);font-size:15px;font-weight:400}
.prw-section[open] > summary::after{content:"−"}
.prw-summary-meta{color:var(--dsw-alias-label-dimmed);font-size:10.5px;font-weight:400;white-space:nowrap}
.prw-section-body{display:flex;flex-direction:column;gap:12px;padding:0 2px 14px;min-width:0}
.prw-kv-group{display:flex;flex-direction:column;gap:5px;min-width:0}
.prw-kv-group h4{margin:0 0 2px;font-size:11px;line-height:16px;font-weight:600;color:var(--dsw-alias-label-secondary)}
.prw-kv-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 18px}
.prw-kv{min-width:0}
.prw-kv span{display:block;color:var(--dsw-alias-label-dimmed);font-size:10px;line-height:14px;margin-bottom:1px}
.prw-kv p{margin:0;font-size:12px;line-height:17px;color:var(--dsw-alias-label-secondary);word-break:break-word}
.prw-paragraph{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.prw-chips{display:flex;flex-wrap:wrap;gap:5px}
.prw-chip{display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:10px;line-height:15px;white-space:nowrap}
.prw-blocks{display:flex;flex-direction:column;gap:6px}
.prw-block{border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-2);overflow:hidden}
.prw-block summary{display:flex;align-items:center;gap:8px;padding:7px 10px;cursor:pointer;font-size:11.5px;line-height:16px;list-style:none}
.prw-block summary::-webkit-details-marker{display:none}
.prw-block summary::after{content:"+";margin-left:auto;color:var(--dsw-alias-label-dimmed);font-size:13px}
.prw-block[open] summary::after{content:"−"}
.prw-block-title{font-weight:500}
.prw-block-meta{color:var(--dsw-alias-label-dimmed);font-size:10px;font-variant-numeric:tabular-nums}
.prw-block-body{display:flex;flex-direction:column;gap:6px;padding:0 10px 10px}
.prw-block-body .prw-prompt{max-height:220px;overflow:auto;font-size:11.5px;background:var(--dsw-alias-bg-layer-1);border-radius:6px;padding:8px}
.prw-block-foot{display:flex;justify-content:flex-end}
.prw-form-wrap{display:flex;flex-direction:column;gap:8px}
.prw-form{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}
.prw-field{display:flex;flex-direction:column;gap:3px;min-width:0}
.prw-field span{color:var(--dsw-alias-label-dimmed);font-size:10px;line-height:14px}
.prw-field-wide{grid-column:1/-1}
.prw-form-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.prw-form-foot p{margin:0}
.prw-two-col{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.prw-two-col h4{margin:0 0 6px;font-size:11px;line-height:16px;font-weight:600;color:var(--dsw-alias-label-secondary)}
.prw-list{margin:0;padding-left:16px;display:flex;flex-direction:column;gap:4px;color:var(--dsw-alias-label-secondary);font-size:11.5px;line-height:18px}
.prw-list strong{color:var(--dsw-alias-label-primary);font-weight:500}
.prw-raw{display:flex;flex-direction:column;gap:6px;border-top:1px solid var(--dsw-alias-border-l1);padding-top:8px;margin-top:2px}
.prw-link{appearance:none;border:none;background:transparent;color:var(--dsw-alias-brand-primary);font:inherit;font-size:11px;cursor:pointer;padding:0;text-align:left}
.prw-raw-pre{max-height:280px;overflow:auto;font-family:var(--ds-font-family-code,ui-monospace,monospace);font-size:11px;line-height:1.7;background:var(--dsw-alias-bg-layer-2);border-radius:6px;padding:8px}
.prw-error-inline{color:var(--dsw-alias-state-error-primary);font-size:11px;margin:0}
.prw-input{width:100%;height:30px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);padding:0 8px;font:inherit;font-size:12px;outline:none}
.prw-input:focus{border-color:var(--dsw-alias-brand-primary)}
.prw-textarea{height:auto;min-height:56px;padding:8px;resize:vertical;line-height:1.6}
.prw-muted{color:var(--dsw-alias-label-dimmed);font-size:11px;line-height:16px}
.prw-lightbox{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.8);cursor:zoom-out}
.prw-lightbox img{max-width:92vw;max-height:90vh;object-fit:contain;border-radius:6px;box-shadow:0 20px 60px rgba(0,0,0,.4)}
.prw-lightbox-close{position:fixed;top:14px;right:20px;width:32px;height:32px;border:none;border-radius:999px;background:rgba(255,255,255,.12);color:#fff;font-size:20px;line-height:32px;cursor:pointer}
.prw-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);padding:8px 16px;border-radius:999px;background:var(--dsw-alias-toast-bg);border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);font-size:12px;box-shadow:0 8px 24px rgba(0,0,0,.18);z-index:50}
@media (max-width:1100px){.prw-rail{width:210px}.prw-main{padding:16px 16px 56px}}
@media (max-width:820px){.prw-rail{display:none}.prw-record-select{display:block}.prw-main{padding:14px 14px 52px}.prw-two-col{grid-template-columns:minmax(0,1fr)}.prw-detail{gap:14px}}
@media (max-width:640px){.prw-hero{grid-template-columns:minmax(0,1fr)}.prw-hero-media{max-width:300px;margin:0 auto}.prw-metrics-primary{grid-template-columns:repeat(2,minmax(0,1fr))}.prw-kv-grid{grid-template-columns:minmax(0,1fr)}.prw-vision{display:none}}
@media (max-width:560px){.prw-vision{display:none}.prw-head{padding:8px 12px}.prw-head-actions{gap:6px}.prw-brand h1{font-size:14px}.prw-hero-title h2{font-size:17px}.prw-tabs{width:100%}.prw-panel-bar{align-items:flex-start}.prw-panel-actions{width:100%;justify-content:flex-end}}
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

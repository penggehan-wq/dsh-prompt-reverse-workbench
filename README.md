# 锚点 · 图片提示词反推台（ANCHOR）

> 显示名是「锚点」，包名仍是 `@local/prompt-reverse-workbench`；只改显示名，不影响安装和已有记录。

上传一张人物图，工作台会：

1. 用当前可用的视觉模型读图，量出**身份卡**：脸型、眼鼻唇、皮肤、发型、头身比、肩宽/头宽、腰臀比、腿身比、面宽/面高、瞳距、鼻宽、嘴宽等。
2. 用确定性模板把身份卡编译成一组提示词：
   - 主提示词（中/英）
   - 身份锁定（中/英）
   - 参考图编辑指令（给 Qwen 原生参考编辑 / 多图参考，原图作为 `<image1>`）
   - 负向提示词
   - 三视图角色设定
   - 一句话精简
3. 支持手动校正身高、头身比、年龄区间、性别，点一次就用同一套模板重编译，不再调用视觉模型。
4. 记录、图片、校正值都保存在本机 `~/.dsh/prompt-reverse`；图片本体走 attachments 内容寻址存储。

## 打开

左侧栏「锚点」→ 上传或拖入图片 → 自动开始反推 → 完成后复制提示词包。

安装或更新后如果左侧栏还是旧样式，刷新一次界面；桌面端必要时重启一次 DSH，让浏览器加载新的 Client bundle。

也支持直接在对话里说「把这张图反推一下」：Agent 会调用 `prompt_reverse_analyze` 工具，把结果存进同一个工作台。

## 为什么能减少脸/身材/身高偏差

- **身份锚点写两遍**：正向开头写一次，结尾再重复一次；负向词同时写「换脸、脸变长、腿变短、肩变窄、腰变粗」。
- **用比例而不是形容词**：头身比、面宽/面高、瞳距/面宽、鼻宽/面宽、嘴宽/面宽、肩宽/头宽、腰臀比、腿身比。图像模型对数字比例比「高挑」「小巧」这类词更敏感。
- **身高不是靠 cm 锁的**：图像无法精确测高，cm 只是估算；真正稳定「身高感」的是头身比、肩宽、腰臀比、腿身比和机位。提示词里会同时写比例与机位。
- **参考图优先**：有原图时用参考编辑 / 多图参考，把原图作为身份图，提示词只描述变化部分，比纯文生图稳得多。
- **固定变量**：固定模型、尺寸、seed、焦段；一次只改服装 / 场景 / 机位中的一个。

## 反推卡新增字段（v1.1）

- **族裔 / 面部骨相**：`ethnicity_en/zh` + `face_structure_en/zh`（面中部平缓度、颧骨、鼻梁、内眦赘皮、下颌角、下巴）。这两项是必填，编译时会写成「族裔锁定」，东亚洲脸会自动加负向 `Caucasian / European / deep-set eyes / high nasal bridge / sharp jaw`，防止生成时漂成欧亚混血。
- **原图技术质感**：`technical`（medium / camera / lens / aperture / ISO / shutter / focal_length / depth_of_field / skin_texture / grain / contrast / color_grade / post_process / quality）。编译时生成 `quality_lock`，并把 `plastic skin / over-smoothed / HDR / flat studio light / 2000s studio portrait` 写进负向词。
- **可见裸体 / 身体细节**：`anatomy.visible_nudity`（none / partial / full）+ `chest / genitals / pubic_hair / buttocks / hand_action / finger_action / contact / pose / details` 的中英字段；`subject_scope` 标记完整人物 / 上半身 / 下半身 / 下体特写 / 局部微距。只描述参考图里真实可见的部分，临床、事实性描述；不可见就留空。
- **局部特写分支**：`subject_scope = genital_closeup / detail_macro` 时，提示词不再补脸、补身高、补族裔，只保留可见局部、手/手指动作、接触、姿势、机位、光线和质感；负向压“补全身、加脸、改阴唇形状/不对称、加/减阴毛、马赛克”。
- **参考图编辑双版本**：`reference_edit_zh` 是 Qwen 的 `<image1>` 语法；`reference_edit_generic_zh` 去掉了 `<image1>`，给 Seedream / Flux Kontext / Gemini / 豆包参考图用。
- **手动补充**：校正区新增「身体 / 手部动作补充」，视觉模型漏掉姿势或手部动作时可以手填，例如“右手自然放在小腹，左腿微屈”，会追加到身体细节和手机版。
- 面板新增「族裔 / 骨相」「原图质感 / 参数」「质感锁定」「身体细节」四块；旧记录需要重新反推一次才会带新字段。

## 手机一键版

面板顶部新增「手机一键版」窗口：一段可直接改、直接复制的中文提示词。

- 不带 `<image1>`、不带负向词、不带参数表，适合豆包 / 即梦 / 其他手机文生图。
- 文本可编辑：换衣服、换场景直接改这一段，再点「复制这段去手机」。
- 手机版按参考图内容原样保留，不做审查删改；平台审核由用户自己决定。
- 文生图锁不住真实身份，要锁脸仍然用参考图编辑。

## 推荐流程

1. 先出一张**半身定妆照**，只验证脸和头身比。
2. 满意后固定 seed 与尺寸，再换服装。
3. 再换场景，最后换机位。
4. 每次生成后按「偏差自检」逐项对照，漂移时只加对应的修正词。

## Agent 工具

- `prompt_reverse_analyze`：把本地路径或对话图片附件存进「锚点」并反推（最长约 4 分钟）。
- `prompt_reverse_list`：列出记录。
- `prompt_reverse_get`：取某条记录的完整提示词、身份卡与原始输出。
- `prompt_reverse_update`：校正身高 / 头身比 / 年龄 / 性别并重编译。

## 配置

`cordis.patch.yml` 的 `config` 可写：

```yaml
- insert:
    - id: prompt-reverse-workbench
      name: '@local/prompt-reverse-workbench'
      config:
        provider: deepseek-account   # 可选，默认跟随当前默认模型
        model: deepseek-flash        # 可选
        effort: low                  # 可选：low / high / max；不支持则回退模型默认
        maxTokens: 8000
        timeoutMs: 240000
        dataDir: ''                  # 可选，默认 ~/.dsh/prompt-reverse
```

不填 `provider` / `model` 时，先用当前默认模型；默认模型不能读图时，会自动在已注册的模型里找一个支持图片输入的。

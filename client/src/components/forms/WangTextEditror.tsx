'use client'

import '@wangeditor/editor/dist/css/style.css'
import { i18nChangeLanguage } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { DomEditor } from '@wangeditor/editor'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { useEffect, useState } from 'react'

function WangTextEditror({
  html,
  setHtml,
  setText,
}: {
  html?: string
  setHtml?: any
  setText: any
}) {
  i18nChangeLanguage('en')

  const [editor, setEditor] = useState<IDomEditor | null>(null)

  const toolbarConfig: Partial<IToolbarConfig> = {}
  toolbarConfig.excludeKeys = ['uploadImage', 'group-video']

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: 'Type here...',
  }

  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <div className="border border-gray-300">
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        className="border-b border-gray-300"
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={setEditor}
        onChange={(editor) => {
          setHtml(editor.getHtml())
          setText(editor.getText())
        }}
      />
    </div>
  )
}

export default WangTextEditror

import ExpoModulesCore

public class UniversalTextInputModule: Module {
  public func definition() -> ModuleDefinition {
    Name("UniversalTextInput")

    View(UniversalTextInputView.self) {
      Prop("value") { (view: UniversalTextInputView, value: String?) in
        view.setValue(value)
      }

      Prop("defaultValue") { (view: UniversalTextInputView, value: String?) in
        view.setDefaultValue(value)
      }

      Prop("placeholder") { (view: UniversalTextInputView, placeholder: String?) in
        view.setPlaceholder(placeholder)
      }

      Prop("editable") { (view: UniversalTextInputView, editable: Bool?) in
        view.setEditable(editable != false)
      }

      Prop("secureTextEntry") { (view: UniversalTextInputView, secure: Bool?) in
        view.setSecureTextEntry(secure == true)
      }

      Prop("multiline") { (view: UniversalTextInputView, multiline: Bool?) in
        view.setMultiline(multiline == true)
      }

      Prop("minLines") { (view: UniversalTextInputView, lines: Int?) in
        view.setMinLines(lines ?? 1)
      }

      Prop("maxLines") { (view: UniversalTextInputView, lines: Int?) in
        if let lines = lines {
          view.setMaxLines(lines)
        }
      }

      Prop("autoFocus") { (view: UniversalTextInputView, autoFocus: Bool?) in
        view.setAutoFocus(autoFocus == true)
      }

      Prop("dark") { (view: UniversalTextInputView, dark: Bool?) in
        view.setDarkMode(dark == true)
      }

      Prop("paddingHorizontal") { (view: UniversalTextInputView, padding: Int?) in
        if let padding = padding { view.setPaddingHorizontal(padding) }
      }

      Prop("paddingVertical") { (view: UniversalTextInputView, padding: Int?) in
        if let padding = padding { view.setPaddingVertical(padding) }
      }

      Events("onChangeText", "onInputFocus", "onInputBlur", "onContentSizeChange")
    }
  }
}

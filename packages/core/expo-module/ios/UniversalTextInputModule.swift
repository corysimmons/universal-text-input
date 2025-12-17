import ExpoModulesCore

public class UniversalTextInputModule: Module {
  public func definition() -> ModuleDefinition {
    Name("UniversalTextInput")

    View(UniversalTextInputView.self) {
      Prop("value") { (view: UniversalTextInputView, value: String?) in
        view.setValue(value)
      }

      Prop("placeholder") { (view: UniversalTextInputView, placeholder: String?) in
        view.setPlaceholder(placeholder)
      }

      Prop("editable") { (view: UniversalTextInputView, editable: Bool) in
        view.setEditable(editable)
      }

      Prop("secureTextEntry") { (view: UniversalTextInputView, secure: Bool) in
        view.setSecureTextEntry(secure)
      }

      Prop("multiline") { (view: UniversalTextInputView, multiline: Bool) in
        view.setMultiline(multiline)
      }

      Prop("autoFocus") { (view: UniversalTextInputView, autoFocus: Bool) in
        view.setAutoFocus(autoFocus)
      }

      Prop("dark") { (view: UniversalTextInputView, dark: Bool) in
        view.setDarkMode(dark)
      }

      Events("onChangeText", "onInputFocus", "onInputBlur")
    }
  }
}

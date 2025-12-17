package expo.modules.universaltextinput

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class UniversalTextInputModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("UniversalTextInput")

    View(UniversalTextInputView::class) {
      Prop("value") { view: UniversalTextInputView, value: String? ->
        view.setValue(value)
      }

      Prop("placeholder") { view: UniversalTextInputView, placeholder: String? ->
        view.setPlaceholder(placeholder)
      }

      Prop("editable") { view: UniversalTextInputView, editable: Boolean ->
        view.setEditable(editable)
      }

      Prop("secureTextEntry") { view: UniversalTextInputView, secure: Boolean ->
        view.setSecureTextEntry(secure)
      }

      Prop("multiline") { view: UniversalTextInputView, multiline: Boolean ->
        view.setMultiline(multiline)
      }

      Prop("autoFocus") { view: UniversalTextInputView, autoFocus: Boolean ->
        view.setAutoFocus(autoFocus)
      }

      Prop("dark") { view: UniversalTextInputView, dark: Boolean ->
        view.setDarkMode(dark)
      }

      Events("onChangeText", "onInputFocus", "onInputBlur")
    }
  }
}

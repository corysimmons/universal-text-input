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

      Prop("defaultValue") { view: UniversalTextInputView, value: String? ->
        view.setDefaultValue(value)
      }

      Prop("placeholder") { view: UniversalTextInputView, placeholder: String? ->
        view.setPlaceholder(placeholder)
      }

      Prop("editable") { view: UniversalTextInputView, editable: Boolean? ->
        view.setEditable(editable != false)
      }

      Prop("secureTextEntry") { view: UniversalTextInputView, secure: Boolean? ->
        view.setSecureTextEntry(secure == true)
      }

      Prop("multiline") { view: UniversalTextInputView, multiline: Boolean? ->
        view.setMultiline(multiline == true)
      }

      Prop("autoFocus") { view: UniversalTextInputView, autoFocus: Boolean? ->
        view.setAutoFocus(autoFocus == true)
      }

      Prop("dark") { view: UniversalTextInputView, dark: Boolean? ->
        view.setDarkMode(dark == true)
      }

      Prop("paddingHorizontal") { view: UniversalTextInputView, padding: Int? ->
        view.setPaddingHorizontal(padding ?: 0)
      }

      Prop("paddingVertical") { view: UniversalTextInputView, padding: Int? ->
        view.setPaddingVertical(padding ?: 0)
      }

      Events("onChangeText", "onInputFocus", "onInputBlur")
    }
  }
}

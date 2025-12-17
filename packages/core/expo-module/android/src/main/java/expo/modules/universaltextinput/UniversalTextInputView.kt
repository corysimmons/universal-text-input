package expo.modules.universaltextinput

import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.text.Editable
import android.text.InputType
import android.text.TextWatcher
import android.view.Gravity
import android.view.View
import android.widget.EditText
import android.widget.FrameLayout
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

class UniversalTextInputView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val editText: EditText = EditText(context)
  private var isMultiline: Boolean = false
  private var isSettingTextProgrammatically: Boolean = false
  private var isDarkMode: Boolean = false
  private var isEditable: Boolean = true

  private val onChangeText by EventDispatcher()
  private val onInputFocus by EventDispatcher()
  private val onInputBlur by EventDispatcher()

  init {
    addView(editText, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
    applyTheme()

    editText.addTextChangedListener(object : TextWatcher {
      override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
      override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
      override fun afterTextChanged(s: Editable?) {
        if (!isSettingTextProgrammatically) {
          onChangeText(mapOf("text" to (s?.toString() ?: "")))
        }
      }
    })

    editText.setOnFocusChangeListener { _, hasFocus ->
      if (hasFocus) {
        onInputFocus(emptyMap<String, Any>())
      } else {
        onInputBlur(emptyMap<String, Any>())
      }
    }
  }

  fun setValue(value: String?) {
    val currentText = editText.text.toString()
    val newValue = value ?: ""
    if (currentText != newValue) {
      isSettingTextProgrammatically = true
      editText.setText(newValue)
      editText.setSelection(editText.text.length)
      isSettingTextProgrammatically = false
    }
  }

  fun setPlaceholder(placeholder: String?) {
    editText.hint = placeholder
  }

  fun setEditable(editable: Boolean) {
    isEditable = editable
    editText.isEnabled = editable
    applyTheme()
  }

  fun setSecureTextEntry(secure: Boolean) {
    editText.inputType = if (secure) {
      InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
    } else if (isMultiline) {
      InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_FLAG_MULTI_LINE
    } else {
      InputType.TYPE_CLASS_TEXT
    }
  }

  fun setMultiline(multiline: Boolean) {
    isMultiline = multiline
    editText.inputType = if (multiline) {
      InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_FLAG_MULTI_LINE
    } else {
      InputType.TYPE_CLASS_TEXT
    }
    editText.isSingleLine = !multiline
    editText.gravity = if (multiline) Gravity.TOP or Gravity.START else Gravity.CENTER_VERTICAL or Gravity.START
  }

  fun setAutoFocus(autoFocus: Boolean) {
    if (autoFocus) {
      editText.post {
        editText.requestFocus()
      }
    }
  }

  fun setDarkMode(dark: Boolean) {
    isDarkMode = dark
    applyTheme()
  }

  private fun applyTheme() {
    val textColor: Int
    val hintColor: Int
    val borderColor: Int
    val backgroundColor: Int

    if (isEditable) {
      textColor = if (isDarkMode) Color.parseColor("#fafafa") else Color.parseColor("#171717")
      hintColor = if (isDarkMode) Color.parseColor("#a3a3a3") else Color.parseColor("#a3a3a3")
      borderColor = if (isDarkMode) Color.parseColor("#404040") else Color.parseColor("#d4d4d4")
      backgroundColor = if (isDarkMode) Color.parseColor("#171717") else Color.parseColor("#ffffff")
    } else {
      // Disabled state - more subtle/dim colors
      textColor = if (isDarkMode) Color.parseColor("#737373") else Color.parseColor("#a3a3a3")
      hintColor = if (isDarkMode) Color.parseColor("#525252") else Color.parseColor("#d4d4d4")
      borderColor = if (isDarkMode) Color.parseColor("#303030") else Color.parseColor("#e5e5e5")
      backgroundColor = if (isDarkMode) Color.parseColor("#1a1a1a") else Color.parseColor("#fafafa")
    }

    editText.setTextColor(textColor)
    editText.setHintTextColor(hintColor)

    val drawable = GradientDrawable().apply {
      setColor(backgroundColor)
      setStroke(2, borderColor)
      cornerRadius = 12f
    }
    editText.background = drawable
    editText.setPadding(32, 24, 32, 24)
  }
}

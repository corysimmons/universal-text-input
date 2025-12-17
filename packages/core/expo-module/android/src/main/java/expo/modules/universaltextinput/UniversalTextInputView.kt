package expo.modules.universaltextinput

import android.content.Context
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.text.Editable
import android.text.InputType
import android.text.TextWatcher
import android.text.method.PasswordTransformationMethod
import android.graphics.Typeface
import android.view.Gravity
import android.widget.EditText
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

class UniversalTextInputView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val editText: EditText = EditText(context)
  private var isMultiline: Boolean = false
  private var isSecure: Boolean = false
  private var isSettingTextProgrammatically: Boolean = false
  private var isDarkMode: Boolean = false
  private var isEditable: Boolean = true
  private var pendingInputTypeUpdate: Boolean = false
  private var hasSetDefaultValue: Boolean = false

  // Reusable objects to reduce allocations
  private val textEventMap = mutableMapOf<String, Any>()
  private val emptyEventMap = emptyMap<String, Any>()
  private val backgroundDrawable = GradientDrawable()

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
          textEventMap["text"] = s?.toString() ?: ""
          onChangeText(textEventMap)
        }
      }
    })

    editText.setOnFocusChangeListener { _, hasFocus ->
      if (hasFocus) {
        onInputFocus(emptyEventMap)
      } else {
        onInputBlur(emptyEventMap)
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

  fun setDefaultValue(value: String?) {
    // Only set once on initial render
    if (!hasSetDefaultValue && value != null) {
      hasSetDefaultValue = true
      isSettingTextProgrammatically = true
      editText.setText(value)
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
    isSecure = secure
    scheduleInputTypeUpdate()
  }

  fun setMultiline(multiline: Boolean) {
    isMultiline = multiline
    editText.isSingleLine = !multiline
    editText.gravity = if (multiline) Gravity.TOP or Gravity.START else Gravity.CENTER_VERTICAL or Gravity.START
    scheduleInputTypeUpdate()
  }

  private fun scheduleInputTypeUpdate() {
    if (!pendingInputTypeUpdate) {
      pendingInputTypeUpdate = true
      editText.post {
        applyInputType()
        pendingInputTypeUpdate = false
      }
    }
  }

  private fun applyInputType() {
    val typeface = editText.typeface

    editText.inputType = when {
      isSecure -> InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
      isMultiline -> InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_FLAG_MULTI_LINE
      else -> InputType.TYPE_CLASS_TEXT
    }

    editText.typeface = typeface
    editText.transformationMethod = if (isSecure) {
      PasswordTransformationMethod.getInstance()
    } else {
      null
    }
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
      textColor = if (isDarkMode) Color.parseColor("#737373") else Color.parseColor("#a3a3a3")
      hintColor = if (isDarkMode) Color.parseColor("#525252") else Color.parseColor("#d4d4d4")
      borderColor = if (isDarkMode) Color.parseColor("#303030") else Color.parseColor("#e5e5e5")
      backgroundColor = if (isDarkMode) Color.parseColor("#1a1a1a") else Color.parseColor("#fafafa")
    }

    editText.setTextColor(textColor)
    editText.setHintTextColor(hintColor)

    backgroundDrawable.setColor(backgroundColor)
    backgroundDrawable.setStroke(2, borderColor)
    backgroundDrawable.cornerRadius = 12f
    editText.background = backgroundDrawable
    editText.setPadding(32, 24, 32, 24)
  }
}

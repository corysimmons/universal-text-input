package expo.modules.universaltextinput

import android.content.Context
import android.graphics.Color
import android.text.Editable
import android.text.InputType
import android.text.TextWatcher
import android.text.method.PasswordTransformationMethod
import android.graphics.Typeface
import android.util.Log
import android.view.Gravity
import android.view.View.MeasureSpec
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

class UniversalTextInputView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val editText: NoPaddingEditText = NoPaddingEditText(context)
  private var isMultiline: Boolean = false
  private var isSecure: Boolean = false
  private var isSettingTextProgrammatically: Boolean = false
  private var isDarkMode: Boolean = false
  private var isEditable: Boolean = true
  private var pendingInputTypeUpdate: Boolean = false
  private var hasSetDefaultValue: Boolean = false

  // Reusable objects to reduce allocations
  private val textEventMap = mutableMapOf<String, Any>()
  private val contentSizeMap = mutableMapOf<String, Any>()
  private val emptyEventMap = emptyMap<String, Any>()
  private var lastReportedHeight: Float = 0f

  private val onChangeText by EventDispatcher()
  private val onInputFocus by EventDispatcher()
  private val onInputBlur by EventDispatcher()
  private val onContentSizeChange by EventDispatcher()

  init {
    addView(editText, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
    // Set initial padding to 0 (only once, props will override)
    editText.setPadding(0, 0, 0, 0)
    editText.compoundDrawablePadding = 0
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

  private var paddingH: Int = 0
  private var paddingV: Int = 0

  private fun reportContentSizeIfNeeded() {
    // Calculate intrinsic content height: text line height + vertical padding
    val lineHeight = editText.lineHeight
    val density = resources.displayMetrics.density
    // Convert back to dp for JS
    val contentHeight = (lineHeight + paddingV * 2) / density

    if (contentHeight != lastReportedHeight && contentHeight > 0) {
      lastReportedHeight = contentHeight
      contentSizeMap["height"] = contentHeight
      Log.d("UTI", "reportContentSizeIfNeeded: lineHeight=$lineHeight, paddingV=$paddingV, contentHeight=$contentHeight")
      onContentSizeChange(contentSizeMap)
    }
  }

  fun setPaddingHorizontal(padding: Int) {
    paddingH = (padding * resources.displayMetrics.density).toInt()
    Log.d("UTI", "setPaddingHorizontal: padding=$padding, paddingH=$paddingH")
    // Apply all padding directly to EditText - NoPaddingEditText handles clip rect
    editText.setPadding(paddingH, paddingV, paddingH, paddingV)
    requestLayout()
    editText.post { reportContentSizeIfNeeded() }
  }

  fun setPaddingVertical(padding: Int) {
    paddingV = (padding * resources.displayMetrics.density).toInt()
    Log.d("UTI", "setPaddingVertical: padding=$padding, paddingV=$paddingV")
    // Apply all padding directly to EditText - NoPaddingEditText handles clip rect
    editText.setPadding(paddingH, paddingV, paddingH, paddingV)
    requestLayout()
    editText.post { reportContentSizeIfNeeded() }
  }

  override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
    super.onLayout(changed, left, top, right, bottom)
    reportContentSizeIfNeeded()
  }

  override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
    val heightMode = MeasureSpec.getMode(heightMeasureSpec)
    val heightSize = MeasureSpec.getSize(heightMeasureSpec)
    val modeName = when (heightMode) {
      MeasureSpec.EXACTLY -> "EXACTLY"
      MeasureSpec.AT_MOST -> "AT_MOST"
      MeasureSpec.UNSPECIFIED -> "UNSPECIFIED"
      else -> "UNKNOWN"
    }
    Log.d("UTI", "onMeasure: heightMode=$modeName, heightSize=$heightSize, paddingV=$paddingV")

    // Only calculate custom height when height is not explicitly specified (i.e., height: 'auto')
    if (heightMode == MeasureSpec.UNSPECIFIED || heightMode == MeasureSpec.AT_MOST) {
      val widthSize = MeasureSpec.getSize(widthMeasureSpec)

      // Measure the EditText with full width - it handles its own padding internally
      val editTextWidthSpec = MeasureSpec.makeMeasureSpec(widthSize, MeasureSpec.EXACTLY)
      val editTextHeightSpec = MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED)
      editText.measure(editTextWidthSpec, editTextHeightSpec)

      // The EditText reports zero compound padding, so we need to add vertical padding explicitly
      val textHeight = editText.measuredHeight
      val totalHeight = textHeight + paddingV * 2

      val finalHeight = if (heightMode == MeasureSpec.AT_MOST) {
        minOf(totalHeight, MeasureSpec.getSize(heightMeasureSpec))
      } else {
        totalHeight
      }

      Log.d("UTI", "onMeasure: textHeight=$textHeight, totalHeight=$totalHeight, finalHeight=$finalHeight")

      setMeasuredDimension(widthSize, finalHeight)

      // Re-measure EditText to fill the final height
      editText.measure(
        editTextWidthSpec,
        MeasureSpec.makeMeasureSpec(finalHeight, MeasureSpec.EXACTLY)
      )
    } else {
      Log.d("UTI", "onMeasure: using super (EXACTLY mode)")
      super.onMeasure(widthMeasureSpec, heightMeasureSpec)
    }
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
    // Apply background directly to EditText - padding is included in its bounds
    editText.setBackgroundColor(backgroundColor)
  }

}

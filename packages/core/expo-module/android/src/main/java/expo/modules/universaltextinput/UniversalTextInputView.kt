package expo.modules.universaltextinput

import android.content.Context
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

class UniversalTextInputView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {

  private val onChangeText by EventDispatcher()
  private val onInputFocus by EventDispatcher()
  private val onInputBlur by EventDispatcher()
  private val onContentSizeChange by EventDispatcher()

  // State holders
  private val textState = mutableStateOf("")
  private val placeholderState = mutableStateOf("")
  private val multilineState = mutableStateOf(false)
  private val minLinesState = mutableStateOf(1)
  private val maxLinesState = mutableStateOf<Int?>(null)
  private val secureState = mutableStateOf(false)
  private val editableState = mutableStateOf(true)
  private val autoFocusState = mutableStateOf(false)
  private val darkState = mutableStateOf(false)

  private var hasSetDefaultValue = false

  private val composeView = ComposeView(context).apply {
    setContent {
      TextInputContent()
    }
  }

  init {
    addView(composeView, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT))
  }

  fun setValue(value: String?) {
    val newValue = value ?: ""
    if (textState.value != newValue) {
      textState.value = newValue
    }
  }

  fun setDefaultValue(value: String?) {
    if (!hasSetDefaultValue && value != null) {
      hasSetDefaultValue = true
      textState.value = value
    }
  }

  fun setPlaceholder(placeholder: String?) {
    placeholderState.value = placeholder ?: ""
  }

  fun setMultiline(multiline: Boolean) {
    multilineState.value = multiline
  }

  fun setMinLines(lines: Int) {
    minLinesState.value = lines
  }

  fun setMaxLines(lines: Int?) {
    maxLinesState.value = lines
  }

  fun setSecureTextEntry(secure: Boolean) {
    secureState.value = secure
  }

  fun setEditable(editable: Boolean) {
    editableState.value = editable
  }

  fun setAutoFocus(autoFocus: Boolean) {
    autoFocusState.value = autoFocus
  }

  fun setDarkMode(dark: Boolean) {
    darkState.value = dark
  }

  @Composable
  private fun TextInputContent() {
    val focusRequester = remember { FocusRequester() }

    LaunchedEffect(autoFocusState.value) {
      if (autoFocusState.value) {
        focusRequester.requestFocus()
      }
    }

    val colorScheme = if (darkState.value) darkColorScheme() else lightColorScheme()

    MaterialTheme(colorScheme = colorScheme) {
      val effectiveMaxLines = if (multilineState.value) {
        maxLinesState.value ?: Int.MAX_VALUE
      } else {
        1
      }

      OutlinedTextField(
        value = textState.value,
        onValueChange = { newValue ->
          textState.value = newValue
          onChangeText(mapOf("text" to newValue))
        },
        placeholder = {
          if (placeholderState.value.isNotEmpty()) {
            Text(placeholderState.value)
          }
        },
        enabled = editableState.value,
        singleLine = !multilineState.value,
        minLines = if (multilineState.value) minLinesState.value else 1,
        maxLines = effectiveMaxLines,
        visualTransformation = if (secureState.value) {
          PasswordVisualTransformation()
        } else {
          VisualTransformation.None
        },
        keyboardOptions = if (secureState.value) {
          KeyboardOptions(keyboardType = KeyboardType.Password)
        } else {
          KeyboardOptions.Default
        },
        modifier = Modifier
          .fillMaxWidth()
          .focusRequester(focusRequester)
          .onFocusChanged { focusState ->
            if (focusState.isFocused) {
              onInputFocus(emptyMap())
            } else {
              onInputBlur(emptyMap())
            }
          }
      )
    }
  }
}

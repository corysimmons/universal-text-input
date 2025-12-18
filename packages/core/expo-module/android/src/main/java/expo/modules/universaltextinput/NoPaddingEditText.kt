package expo.modules.universaltextinput

import android.content.Context
import android.graphics.Canvas
import android.graphics.Rect
import android.util.AttributeSet
import android.util.Log
import android.widget.EditText

/**
 * Custom EditText that prevents text clipping when vertical padding is applied.
 *
 * Android's EditText clips text to (viewHeight - paddingTop - paddingBottom).
 * This class overrides the clip rect to use full view bounds for text rendering.
 *
 * For single-line inputs with CENTER_VERTICAL gravity, we report zero padding
 * so gravity handles vertical centering correctly.
 *
 * For multiline inputs with TOP gravity, we return actual padding so text
 * is properly offset from the top edge.
 */
class NoPaddingEditText @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = android.R.attr.editTextStyle
) : EditText(context, attrs, defStyleAttr) {

    init {
        // Remove default background drawable which may include its own padding
        background = null
        // Use ascent/descent only for more predictable text bounds
        includeFontPadding = false
    }

    // For single-line, report zero padding so gravity centers text correctly
    // For multiline, return actual padding so text is offset from top
    override fun getCompoundPaddingTop(): Int {
        val result = if (isSingleLine) 0 else paddingTop
        Log.d("UTI", "getCompoundPaddingTop: isSingleLine=$isSingleLine, paddingTop=$paddingTop, returning=$result")
        return result
    }
    override fun getCompoundPaddingBottom(): Int = if (isSingleLine) 0 else paddingBottom
    override fun getExtendedPaddingTop(): Int = if (isSingleLine) 0 else paddingTop
    override fun getExtendedPaddingBottom(): Int = if (isSingleLine) 0 else paddingBottom

    override fun onDraw(canvas: Canvas) {
        // Save the canvas state
        canvas.save()

        // Remove any clip rect restrictions - allow drawing to full view bounds
        canvas.clipRect(0, 0, width, height)

        // Draw the text
        super.onDraw(canvas)

        // Restore canvas state
        canvas.restore()
    }
}

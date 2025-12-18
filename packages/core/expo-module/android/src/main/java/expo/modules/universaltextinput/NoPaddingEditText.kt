package expo.modules.universaltextinput

import android.content.Context
import android.graphics.Canvas
import android.graphics.Rect
import android.util.AttributeSet
import android.widget.EditText

/**
 * Custom EditText that prevents text clipping when vertical padding is applied.
 *
 * Android's EditText clips text to (viewHeight - paddingTop - paddingBottom).
 * This class overrides the clip rect to use full view bounds for text rendering.
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

    // Report zero vertical padding to the text layout system
    override fun getCompoundPaddingTop(): Int = 0
    override fun getCompoundPaddingBottom(): Int = 0
    override fun getExtendedPaddingTop(): Int = 0
    override fun getExtendedPaddingBottom(): Int = 0

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

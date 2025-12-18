package expo.modules.universaltextinput

import android.content.Context
import android.graphics.Canvas
import android.util.AttributeSet
import android.widget.EditText

/**
 * Custom EditText that prevents text clipping when vertical padding is applied
 * for SINGLE-LINE inputs only.
 *
 * For single-line with CENTER_VERTICAL gravity and padding, Android clips text.
 * This class fixes that by reporting zero compound padding and expanding clip rect.
 *
 * For multiline, this class behaves exactly like a standard EditText.
 */
class NoPaddingEditText @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = android.R.attr.editTextStyle
) : EditText(context, attrs, defStyleAttr) {

    init {
        // Remove default background drawable which may include its own padding
        background = null
    }

    override fun setSingleLine(singleLine: Boolean) {
        super.setSingleLine(singleLine)
        // Only disable font padding for single-line where we need precise control
        includeFontPadding = !singleLine
    }

    // For single-line, report zero padding so gravity centers text correctly
    // For multiline, use default behavior - standard EditText
    override fun getCompoundPaddingTop(): Int = if (isSingleLine) 0 else super.getCompoundPaddingTop()
    override fun getCompoundPaddingBottom(): Int = if (isSingleLine) 0 else super.getCompoundPaddingBottom()
    override fun getExtendedPaddingTop(): Int = if (isSingleLine) 0 else super.getExtendedPaddingTop()
    override fun getExtendedPaddingBottom(): Int = if (isSingleLine) 0 else super.getExtendedPaddingBottom()

    override fun onDraw(canvas: Canvas) {
        // Only override clip rect for single-line inputs
        // For multiline, use standard EditText drawing
        if (isSingleLine) {
            canvas.save()
            canvas.clipRect(0, 0, width, height)
            super.onDraw(canvas)
            canvas.restore()
        } else {
            super.onDraw(canvas)
        }
    }
}

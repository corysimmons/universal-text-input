The Problem
On Android, adding vertical padding to a TextInput causes the text content to clip, even though the input visually expands to include the padding. Horizontal padding works correctly. The issue doesn't occur on web.
What's Likely Happening
Android's native EditText calculates the text drawing bounds separately from the view's padding. When you add vertical padding, the outer container grows, but the internal text rendering area doesn't expand accordingly—it stays the same height and gets pushed into a space that's now too small, causing clipping.
Key Terms for Searching/Discussing

"EditText vertical padding text clipping"
includeFontPadding — Android adds extra padding for accent marks by default; setting this to false sometimes helps (or makes it worse)
textAlignVertical — should be "center" or "top" to control where text sits
Intrinsic content height vs. explicit height with padding

Questions to Clarify

Are you setting an explicit height on the input, or letting it size naturally?
Is this a single-line or multiline input?
Are you applying padding via style props or trying to set it at the native module level?

If you're building the native module yourself, the fix often involves overriding how the EditText calculates its measured height to account for padding, or adjusting the text bounds after padding is applied. Want to dig into the native Android side of this?can you do a deep dive and web search the crap out of this from lots of angles. i feel like if the "height" of the android input was the same size as the text or line height it'd work2:39 AMThinking about Android input height alignment with text line height.The user wants me to do comprehensive research on this Android TextInput padding/clipping issue. They have a hypothesis that if the height of the Android input matched the text/line height, it would work correctly. Let me search from multiple angles to understand this problem deeply.I'll dig deep into this from multiple angles. Let me search extensively.22 stepsAndroid EditText getCompoundPaddingTop text clip region height mismatch10 resultsTextInputLayout with AppCompatEditText/Edittext padding problem · Issue #374 · material-components/material-components-androidgithub.comEditText | API reference | Android Developersandroid.comTextView | API reference | Android Developersandroid.comappcompat-v7 can't set padding on EditText or Spinner via ...google.com[TextInputEditText] Vertically cut off · Issue #1136 · material-components/material-components-androidgithub.com[TextInputEditText] The height of a resized TextInputEditText gets changed after an icon is displayed · Issue #1773 · material-components/material-components-androidgithub.comFixing Font Padding in Compose Text | by Alejandra Stamato | Android Developers | Mediummedium.comAndroid: Programmatically Setting Padding for TextViewscopyprogramming.comandroid.widget.EditText.getCompoundPaddingLeft java code examples | Tabninetabnine.comandroid.widget.TextView.setPadding java code examples | Tabninetabnine.comSynthesized comprehensive analysis across multiple dimensions.I have collected a lot of information. Let me now synthesize this into a comprehensive problem articulation for the user.Excellent research session. Here's a comprehensive articulation of your problem:

The Problem: Android EditText Vertical Padding Causes Text Clipping
When you add vertical padding to an Android EditText (or AppCompatEditText, which React Native/Expo uses), the view grows to accommodate the padding, but the internal text drawing region doesn't expand accordingly—it stays sized to the original text content area. The text then gets clipped because it's being drawn into a region that's now smaller than the visible padded area.
Horizontal padding doesn't cause this because the text can reflow. Vertical padding is different—the text height is fixed based on font metrics.

Root Cause: Disconnect Between View Height and Text Content Bounds
Android's TextView/EditText calculates the text drawing region separately from the view's padding:

View height = paddingTop + paddingBottom + content height
Text content height is calculated from font metrics (ascent, descent, top, bottom)
When you set padding, the content area shrinks while the view grows, creating a mismatch

The text gets clipped to the content area bounds, which now doesn't match the visual expectations.

Why Your Intuition Is Correct
Your theory about matching the input height to the text/line height is on the right track. The issue is that:

Android expects the intrinsic content height to be based on font metrics
When you add padding via setPadding(), it pushes the content inward but doesn't tell the text layout system to recalculate its available drawing space
The Layout object (either StaticLayout or BoringLayout) that handles text rendering uses the pre-padding content bounds

The Key Players
Font Metrics That Control Height:

ascent / descent — normal text bounds
top / bottom — includes room for accents/diacritics
includeFontPadding — when true, uses top/bottom instead of ascent/descent

The View Methods Involved:

setPadding() — sets view padding
getCompoundPaddingTop() / getCompoundPaddingBottom() — includes padding + drawable space
getExtendedPaddingTop() — includes padding + extra space for maxLines constraints

Potential Solutions for Your Expo Module

1. Don't use setPadding() for vertical padding at all
   Instead, wrap the EditText in a container and apply padding to the container. Let the EditText size itself to its intrinsic content height.
2. Override onMeasure() to account for padding properly
   kotlinoverride fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
   super.onMeasure(widthMeasureSpec, heightMeasureSpec)
   // Re-measure to include the actual text height + your desired padding
   val textHeight = paint.fontMetrics.let { it.bottom - it.top }
   val desiredHeight = textHeight + paddingTop + paddingBottom
   setMeasuredDimension(measuredWidth, desiredHeight.toInt())
   }
3. Use minHeight instead of padding
   Set minHeight to lineHeight + desiredVerticalPadding \* 2 to guarantee space, then use gravity to center the text.
4. Set includeFontPadding = false and manually compensate
   This gives you more predictable text bounds (ascent/descent only), then you add your own padding. But be aware—this can cause clipping for tall scripts (Burmese, Thai, etc.).
5. Use a wrapper approach (the "safe" solution)
   kotlin// Don't apply paddingTop/Bottom to the EditText
   // Instead, use a FrameLayout with padding around it
   editText.setPadding(horizontalPadding, 0, horizontalPadding, 0)
   wrapperView.setPadding(0, verticalPadding, 0, verticalPadding)

Why This Doesn't Happen on Web
Web's <input> and <textarea> use CSS box model padding, which naturally expands the content box. The text rendering system respects the padded content area. Android's view system was designed differently—padding shrinks the content region rather than expanding the text area.

Bottom Line: Your instinct is right. The fix involves either:

(A) Making the native EditText's measured height = text height only, then applying padding externally
(B) Overriding measurement to properly account for padding in the content bounds
(C) Using minHeight/gravity rather than padding for vertical spacing

Want me to dig into any of these approaches more specifically for your Expo module implementation?

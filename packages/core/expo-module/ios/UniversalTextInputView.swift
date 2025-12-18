import ExpoModulesCore
import UIKit

class UniversalTextInputView: ExpoView, UITextFieldDelegate, UITextViewDelegate {
  private var textField: UITextField?
  private var textView: UITextView?
  private var isMultiline: Bool = false
  private var isSecure: Bool = false
  private var placeholderText: String?
  private var isSettingTextProgrammatically: Bool = false
  private var isDarkMode: Bool = false
  private var isEditableState: Bool = true
  private var hasSetDefaultValue: Bool = false
  private var minLinesCount: Int?
  private var maxLinesCount: Int?

  let onChangeText = EventDispatcher()
  let onInputFocus = EventDispatcher()
  let onInputBlur = EventDispatcher()
  let onContentSizeChange = EventDispatcher()

  // Theme colors - account for both dark mode and disabled state
  private var textColor: UIColor {
    if isEditableState {
      return isDarkMode ? UIColor(hex: "#fafafa") : UIColor(hex: "#171717")
    } else {
      return isDarkMode ? UIColor(hex: "#737373") : UIColor(hex: "#a3a3a3")
    }
  }
  private var placeholderColor: UIColor {
    if isEditableState {
      return UIColor(hex: "#a3a3a3")
    } else {
      return isDarkMode ? UIColor(hex: "#525252") : UIColor(hex: "#d4d4d4")
    }
  }
  private var borderColor: UIColor {
    if isEditableState {
      return isDarkMode ? UIColor(hex: "#404040") : UIColor(hex: "#d4d4d4")
    } else {
      return isDarkMode ? UIColor(hex: "#303030") : UIColor(hex: "#e5e5e5")
    }
  }
  private var bgColor: UIColor {
    if isEditableState {
      return isDarkMode ? UIColor(hex: "#171717") : UIColor(hex: "#ffffff")
    } else {
      return isDarkMode ? UIColor(hex: "#1a1a1a") : UIColor(hex: "#fafafa")
    }
  }

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    setupTextField()
  }

  private func setupTextField() {
    let field = UITextField()
    field.delegate = self
    field.borderStyle = .none
    field.addTarget(self, action: #selector(textFieldDidChange), for: .editingChanged)
    field.translatesAutoresizingMaskIntoConstraints = false
    field.layer.cornerRadius = 0
    field.layer.borderWidth = 0
    addSubview(field)

    NSLayoutConstraint.activate([
      field.topAnchor.constraint(equalTo: topAnchor),
      field.leadingAnchor.constraint(equalTo: leadingAnchor),
      field.trailingAnchor.constraint(equalTo: trailingAnchor),
      field.bottomAnchor.constraint(equalTo: bottomAnchor)
    ])

    textField = field
    textField?.isSecureTextEntry = isSecure
    applyTheme()
  }

  private func setupTextView() {
    textField?.removeFromSuperview()
    textField = nil

    let view = UITextView()
    view.delegate = self
    view.font = UIFont.systemFont(ofSize: 16)
    view.layer.borderWidth = 0
    view.layer.cornerRadius = 0
    view.textContainerInset = .zero
    view.textContainer.lineFragmentPadding = 0
    view.translatesAutoresizingMaskIntoConstraints = false
    addSubview(view)

    NSLayoutConstraint.activate([
      view.topAnchor.constraint(equalTo: topAnchor),
      view.leadingAnchor.constraint(equalTo: leadingAnchor),
      view.trailingAnchor.constraint(equalTo: trailingAnchor),
      view.bottomAnchor.constraint(equalTo: bottomAnchor)
    ])

    textView = view
    applyTheme()
  }

  func setValue(_ value: String?) {
    let newValue = value ?? ""
    let currentValue = isMultiline ? (textView?.text ?? "") : (textField?.text ?? "")

    if currentValue != newValue {
      isSettingTextProgrammatically = true
      if isMultiline {
        textView?.text = newValue
      } else {
        textField?.text = newValue
      }
      isSettingTextProgrammatically = false
    }
  }

  func setDefaultValue(_ value: String?) {
    guard !hasSetDefaultValue, let value = value else { return }
    hasSetDefaultValue = true
    isSettingTextProgrammatically = true
    if isMultiline {
      textView?.text = value
    } else {
      textField?.text = value
    }
    isSettingTextProgrammatically = false
  }

  func setPlaceholder(_ placeholder: String?) {
    placeholderText = placeholder
    textField?.placeholder = placeholder
  }

  func setEditable(_ editable: Bool) {
    isEditableState = editable
    textField?.isEnabled = editable
    textView?.isEditable = editable
    applyTheme()
  }

  func setSecureTextEntry(_ secure: Bool) {
    isSecure = secure
    textField?.isSecureTextEntry = secure
  }

  func setMultiline(_ multiline: Bool) {
    guard multiline != isMultiline else { return }
    isMultiline = multiline

    if multiline {
      setupTextView()
    } else {
      textView?.removeFromSuperview()
      textView = nil
      setupTextField()
    }
  }

  func setMinLines(_ lines: Int) {
    minLinesCount = lines
    // iOS UITextView doesn't have native minLines support
    // Height is typically controlled by constraints from React Native
  }

  func setMaxLines(_ lines: Int) {
    maxLinesCount = lines
    // iOS UITextView doesn't have native maxLines support
    // Height is typically controlled by constraints from React Native
  }

  func setAutoFocus(_ autoFocus: Bool) {
    if autoFocus {
      DispatchQueue.main.async { [weak self] in
        if self?.isMultiline == true {
          self?.textView?.becomeFirstResponder()
        } else {
          self?.textField?.becomeFirstResponder()
        }
      }
    }
  }

  @objc private func textFieldDidChange() {
    if !isSettingTextProgrammatically {
      onChangeText(["text": textField?.text ?? ""])
    }
  }

  // MARK: - UITextFieldDelegate

  func textFieldDidBeginEditing(_ textField: UITextField) {
    onInputFocus()
  }

  func textFieldDidEndEditing(_ textField: UITextField) {
    onInputBlur()
  }

  // MARK: - UITextViewDelegate

  func textViewDidChange(_ textView: UITextView) {
    if !isSettingTextProgrammatically {
      onChangeText(["text": textView.text ?? ""])
    }
  }

  func textViewDidBeginEditing(_ textView: UITextView) {
    onInputFocus()
  }

  func textViewDidEndEditing(_ textView: UITextView) {
    onInputBlur()
  }

  func setDarkMode(_ dark: Bool) {
    isDarkMode = dark
    applyTheme()
  }

  private var paddingH: CGFloat = 0
  private var paddingV: CGFloat = 0

  func setPaddingHorizontal(_ padding: Int) {
    paddingH = CGFloat(padding)
    applyPadding()
  }

  func setPaddingVertical(_ padding: Int) {
    paddingV = CGFloat(padding)
    applyPadding()
  }

  private func applyPadding() {
    // For UITextField, use leftView/rightView for horizontal padding
    textField?.leftView = UIView(frame: CGRect(x: 0, y: 0, width: paddingH, height: 1))
    textField?.leftViewMode = .always
    textField?.rightView = UIView(frame: CGRect(x: 0, y: 0, width: paddingH, height: 1))
    textField?.rightViewMode = .always

    // For UITextView, use textContainerInset
    textView?.textContainerInset = UIEdgeInsets(top: paddingV, left: paddingH, bottom: paddingV, right: paddingH)
  }

  private func applyTheme() {
    textField?.textColor = textColor
    textField?.backgroundColor = bgColor
    textField?.layer.borderColor = borderColor.cgColor
    if let placeholder = placeholderText {
      textField?.attributedPlaceholder = NSAttributedString(
        string: placeholder,
        attributes: [.foregroundColor: placeholderColor]
      )
    }

    textView?.textColor = textColor
    textView?.backgroundColor = bgColor
    textView?.layer.borderColor = borderColor.cgColor
  }
}

// MARK: - UIColor Hex Extension

extension UIColor {
  convenience init(hex: String) {
    let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
    var int: UInt64 = 0
    Scanner(string: hex).scanHexInt64(&int)
    let a, r, g, b: UInt64
    switch hex.count {
    case 3: // RGB (12-bit)
      (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
    case 6: // RGB (24-bit)
      (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
    case 8: // ARGB (32-bit)
      (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
    default:
      (a, r, g, b) = (255, 0, 0, 0)
    }
    self.init(red: Double(r) / 255, green: Double(g) / 255, blue: Double(b) / 255, alpha: Double(a) / 255)
  }
}

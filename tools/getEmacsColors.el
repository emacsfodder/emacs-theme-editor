;; Quickly grab all the named colors from Emacs
;; this is intended to be run with `M-x load-file`
(defun color-hex ( i )
  (format "%02X" (floor (* 255 (/ (float i) (float 65535) )))))

(progn
  (insert "var emacsColors = [\n")
  (setq beg (point))
  (loop for c in (defined-colors)
        if (numberp (nth 0 (color-values c)))
        do
        (insert "    { name: \"" c "\", ")
        (insert "color: \"#"
                (color-hex (nth 0 (color-values c)))
                (color-hex (nth 1 (color-values c)))
                (color-hex (nth 2 (color-values c))))
        (insert "\" },\n"))

  (align-regexp beg (point) "color:")
  (backward-delete-char 2 )
  (insert "\n];"))

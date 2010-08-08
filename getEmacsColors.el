(progn
  
  ;; The number of defined-colors ... probably won't need this... :)
  ;; (setq c (list-length (defined-colors)))

  (insert "var emacsColors = [\n")

  (setq beg (point))

  (loop for c in (defined-colors)
	if (numberp (nth 0 (color-values c)))
	do 
	(insert "    { name: \"" c "\", ")
	;; Dirty align coloumn... 
	;; (insert (make-string (- 50 (current-column)) 32))
	;; Better to note the length of defined-colors and align-regexp
        ;; on a computed region. 
        ;; (will use values from a & c to set region)
	(insert "color: \"#" 
		(color-hex
		 (nth 0 (color-values c))) 
		(color-hex
		 (nth 1 (color-values c))) 
		(color-hex
		 (nth 2 (color-values c))) 
		)
	(insert "\" },\n")
	)

  (align-regexp beg (point) "color:")

  (backward-delete-char 2 )

  (insert "\n];")
  ;; need to add - set region from row a to row b.

  (defun color-hex ( i )
    (format "%02X" (floor (* 255 (/ (float i) (float 65535) ))))
    )
  )


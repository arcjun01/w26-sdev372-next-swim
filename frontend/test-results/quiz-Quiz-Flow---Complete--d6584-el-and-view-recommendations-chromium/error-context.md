# Page snapshot

```yaml
- generic [ref=e3]:
  - banner:
    - img "Header" [ref=e4]
  - generic [ref=e6]:
    - heading "Setting Up Student Surveys" [level=1] [ref=e8]
    - paragraph [ref=e10]: Once you complete this setup, a link to a customized student survey will be generated.
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]: For which course is this team set-up for?
        - textbox "For which course is this team set-up for?" [ref=e14]:
          - /placeholder: e.g., SDEV 100
      - generic [ref=e15]:
        - generic [ref=e16]: Enter or adjust class size
        - spinbutton "Enter or adjust class size" [ref=e17]
      - generic [ref=e18]:
        - generic [ref=e19]: Enter or adjust group size
        - generic [ref=e20]:
          - generic [ref=e21]:
            - generic [ref=e22]: "Min:"
            - spinbutton [ref=e23]
          - generic [ref=e24]:
            - generic [ref=e25]: "Max:"
            - spinbutton [ref=e26]
      - generic [ref=e28] [cursor=pointer]:
        - checkbox "Factor prerequisite GPA into team formation" [ref=e29]
        - generic [ref=e30]: Factor prerequisite GPA into team formation
      - generic [ref=e31]:
        - button "Cancel" [ref=e32] [cursor=pointer]
        - button "Create Student Survey" [ref=e33] [cursor=pointer]
```
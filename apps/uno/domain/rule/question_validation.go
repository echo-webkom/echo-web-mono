package rule

import (
	"encoding/json"
	"uno/domain/model"
)

// ValidateQuestionsAgainstAnswers checks that required questions are answered and answers match question constraints.
func ValidateQuestionsAgainstAnswers(questions []model.Question, answers []model.QuestionAnswer) bool {
	for _, question := range questions {
		var answer *model.QuestionAnswer
		for i := range answers {
			if answers[i].QuestionID == question.ID {
				answer = &answers[i]
				break
			}
		}

		if answer == nil || len(answer.Answer) == 0 {
			if question.Required {
				return false
			}
			continue
		}

		switch question.Type {
		case "text", "radio":
			var str string
			if err := json.Unmarshal(answer.Answer, &str); err != nil {
				return false
			}
			if question.Required && len(str) == 0 {
				return false
			}
		case "checkbox":
			var arr []string
			if err := json.Unmarshal(answer.Answer, &arr); err != nil {
				return false
			}
			if question.Required && len(arr) == 0 {
				return false
			}
			if question.Options != nil && len(arr) > 0 {
				var options []struct {
					Value string `json:"value"`
				}
				if err := json.Unmarshal(*question.Options, &options); err == nil {
					validValues := make(map[string]bool)
					for _, opt := range options {
						validValues[opt.Value] = true
					}
					for _, val := range arr {
						if !validValues[val] {
							return false
						}
					}
				}
			}
		default:
			return false
		}
	}

	return true
}

KNOWN = [
    {
        'allergier?': 'answer'
    },
    {
        'preferanser?': 'answer'
    }
]

list_of_questions = [
    {
        'allergier?': 'ja'
    },     
    {
        'preferanser?': 'hamburger',
    }
]

def check_if_equal(question, checkedlist):
    for i in question:    
        if i not in checkedlist and i in KNOWN:
            print(i)
    return True

def check_all_question(questions:list[dict]):
    checked = []

    for i, question in enumerate(questions):
        if check_if_equal(question.keys(), checked):
            checked.append(list(question.keys())[0])
            print(i)
    
    print(checked)


    return True

allQuestionsAnswered = check_all_question(list_of_questions)


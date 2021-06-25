import { useHistory, useParams } from 'react-router-dom'

import LogoutImg from '../assets/images/logout.svg'
import LogoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { Button } from '../componentes/Button'
import { Question } from '../componentes/Question/index'
import { RoomCode } from '../componentes/RoomCode'
// import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'

import '../styles/room.scss'
import { database } from '../services/firebase'

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    // const {user} = useAuth()
    const history = useHistory()
    const params = useParams<RoomParams>()
    const roomId = params.id
    
    
    const { title, questions } = useRoom(roomId)
    console.log(questions)

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endeedAt: new Date(),
        })

        history.push('/')
    }

    async function handleDeleteQuestion (questionId: string) {
        if (window.confirm('Tem certeza que você deseja excluir essa pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }
    async function handleCheckQuestionAsAnswered (questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })
    }
    async function handleHighLightQuestion (questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: true,
        })
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={LogoImg} alt="Ask-me" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>
                            <img onClick={handleEndRoom} src={LogoutImg} alt="Encerrar sala" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return(
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author} 
                                isHighLighted={question.isHighLighted}
                                isAnswered={question.isAnswered}
                            >
                               {!question.isAnswered && (
                                   <>
                                    <button
                                    type='button'
                                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                >
                                    <img src={checkImg} alt="Remover pergunta" />
                                </button>
                                <button
                                    type='button'
                                    onClick={() => handleHighLightQuestion(question.id)}
                                >
                                    <img src={answerImg} alt="Remover pergunta" />
                                </button>
                                   </>
                               )}
                                <button
                                    type='button'
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>    
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
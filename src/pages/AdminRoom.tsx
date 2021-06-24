import { useHistory, useParams } from 'react-router-dom'

import LogoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'

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

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endeedAt: new Date(),
        })

        history.push('/')
    }

    async function handleDeleteQuesrtion (questionId: string) {
        if (window.confirm('Tem certeza que você deseja excluir essa pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={LogoImg} alt="Ask-me" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom} >Encerrar</Button>
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
                            >
                                <button
                                    type='button'
                                    onClick={() => handleDeleteQuesrtion(question.id)}
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
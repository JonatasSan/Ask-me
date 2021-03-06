
import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
// import { AuthContext } from '../contexts/AuthContext'

import illustrationImg from '../assets/images/illustration.svg'
// import logoImg from '../assets/images/logo.png'
import logoImg from '../assets/images/juntos.svg'
import { Button } from '../componentes/Button'
import { database } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'

import '../styles/auth.scss'

export function NewRoom(){
    const { user } = useAuth()
    const history = useHistory()
    const [newRoom, setNewRoom] = useState('')

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault()

        if (newRoom.trim()=== '' ){
            return
        }

        const roomRef = database.ref('rooms')

        const firebaseRoom = roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })
        
        history.push(`/rooms/${firebaseRoom.key}`)
    }

    return(
        <div id='page-auth'>
            <aside>
                <img src={illustrationImg} alt="Ilustração simnolizando perguntas e respostas" />
                <strong>Toda pergunta tem uma resposta</strong>
                <p>Tire suas duvidas em tempo real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="Ask-me" />
                    <h2>Criar uma nova sala</h2><br /><br />
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder='Nome da sala'
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type='submit'>
                            Criar sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala existente?<Link to="/">clique aqui</Link> </p>
                </div>
            </main>
        </div>
    )
}
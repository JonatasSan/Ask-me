
import { useHistory } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import {FiLogIn} from'react-icons/fi'
import googleIconImg from '../assets/images/google-icon.svg'
import { FaFacebookF } from 'react-icons/fa'

import { Button } from '../componentes/Button'
import { useAuth } from '../hooks/useAuth'

import '../styles/auth.scss'
import { FormEvent } from 'react'
import { useState } from 'react'
import { database } from '../services/firebase'

export function Home(){
    const history = useHistory()
    const { user ,signInWithGoogle } = useAuth()
    const [roomCode, setRoomCode] = useState('')


    async function hendleCreateRoom(){
        if (!user){
            await signInWithGoogle()
        }
       
        history.push('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault()

        if (roomCode.trim() === '') {
            return
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get()

        if (!roomRef.exists()) {
            alert('room does not exists')
            return 
        }

        if (roomRef.val().endedAt) {
            alert('room already closed.')
            return
        }

        history.push(`/rooms/${roomCode}`)
    }

    return(
        <div id='page-auth'>
            <aside>
                <img src={illustrationImg} alt="Ilustração simnolizando perguntas e respostas" />
                <strong>Toda pergunta tem uma resposta</strong>
                <p>Tire suas duvidas em tempo real </p>
            </aside>
            <main>
                <div className='main-content'>
                    <h1 className='login'>Login:</h1>
                    {/* <img src={logoImg} alt="Ask-me" /> */}
                    <button onClick={hendleCreateRoom} className='create-room-facebook'>
                        <FaFacebookF size={30} />
                        Crie sua sala com o Facebook 
                    </button>
                    <button onClick={hendleCreateRoom} className='create-room'>
                        <img src={googleIconImg} alt="Logo da Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className='separator'>ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder='Digite o código da sala'
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type='submit'>
                            <FiLogIn size={20} />
                            Entrar
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}
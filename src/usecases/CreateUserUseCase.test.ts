import {expect, it, describe, beforeEach} from 'vitest'
import {CreateUserUseCase} from "@/usecases/CreateUserUseCase"
import {InMemoryUserRepository} from '@/repositories/in-memory-user-repository'

 //TODO: Criar um repositório em memória para simular o banco de dados.  

 describe('Create User Use Case', () => {
    let userRepository: InMemoryUserRepository
    let sut: CreateUserUseCase

    beforeEach(()=> {
        userRepository = new InMemoryUserRepository()
        sut = new CreateUserUseCase(userRepository)
    })

    it('should be able to create a new user', async ()=> {
        const user = await sut.execute({
            name: "testando",
            email: "teste@email.com",
            password: "password123",
            cpf: "12345678910"
        })

        console.log('Usuario:' , user)

        expect(user.id).toStrictEqual(expect.any(String))
        expect(userRepository.items).toHaveLength(1)
        expect(userRepository.items[0]?.name).toBe('testando')
    })

    it('should not be able to create a new user with an existing email', async ()=> {
        const email = 'duplicate@email.com'
        
        await sut.execute({
            name: 'User 01',
            email,
            password: 'password123',
            cpf: '12345678910'
        })

        await expect(()=> 
            sut.execute({
                name: 'User 02',
                email,
                password: 'password123',
                cpf: '00000000000'
            })
        ).rejects.toBeInstanceOf(Error)
    })
 })
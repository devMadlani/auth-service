import { DataSource } from 'typeorm'

export const truncateTables = async (connection: DataSource) => {
    const entites = connection.entityMetadatas
    for (const entity of entites) {
        const repositry = connection.getRepository(entity.name)
        await repositry.clear()
    }
}

export const isJWT = (token: string | null): boolean => {
    if (!token) return false
    const parts = token.split('.')
    if (parts.length != 3) {
        return false
    }
    try {
        parts.forEach((part) => {
            Buffer.from(part, 'base64').toString('utf-8')
        })
        return true
    } catch (err) {
        return false
    }
}

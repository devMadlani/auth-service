import { DataSource } from 'typeorm'

const truncateTables = async (connection: DataSource) => {
    const entites = connection.entityMetadatas
    for (const entity of entites) {
        const repositry = connection.getRepository(entity.name)
        await repositry.clear()
    }
}

export default truncateTables

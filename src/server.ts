import {app} from '@/app'
import {env} from '@/env'

app.listen(env.PORT, () => {
    console.log(`Servidor rodando na porta ${env.PORT}`);
}); 


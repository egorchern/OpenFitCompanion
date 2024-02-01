import { Link } from '@mui/material';
import Button from '@mui/material/Button';
import { useMutation, useQuery, useQueryClient } from 'react-query';
const PERSONAL_SECRET = localStorage.getItem("API_SECRET")
const baseApi = 'https://j36jvcdbxaumnmb7odfz64rjoa0ozyzj.lambda-url.us-east-1.on.aws'
function useExport() {
    return useMutation({
        mutationKey: "export",
        mutationFn: async () => {
            const url = new URL(`${baseApi}/export`)
            const response = await fetch(url, {
                headers: {
                    "authorization": `Bearer ${PERSONAL_SECRET}`
                },
                method: "POST"
            })
            const result = await response.json()
            console.log(result)
            return result
        }
    })
}
export default function Export() {
    const queryClient = useQueryClient();
    const mutation = useExport()

    const data = mutation.data
    const status = mutation.status
    const handleExportBtn = () => {
        mutation.mutate()
    }
    console.log(status)
    return (
        <div className='flex-vertical'>
            <h2>Data export</h2>

            {
                status === 'success' ? (
                    <Link underline="hover" href={data.URL}>Private Download URL</Link>
                ) : (
                    <Button variant='contained' onClick={handleExportBtn}>
                        Export CSV
                    </Button>
                )
            }

        </div>

    )
}

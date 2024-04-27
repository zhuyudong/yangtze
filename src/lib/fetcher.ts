import axios from '@/lib/axios'

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default fetcher

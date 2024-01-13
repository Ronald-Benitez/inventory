import axios from "axios";

interface Props {
    id: number
    reload: () => void
    url: string
    onSuccess: () => void
    onError: () => void
    onFinally: () => void
}

export const handleDelete = ({ id, onSuccess, onError, reload, url, onFinally }: Props) => {
    axios
        .delete(url, {
            data: {
                id
            },
        })
        .then((res) => {
            onSuccess()
            reload();
        })
        .catch((err) => {
            onError()
        }).finally(() => {
            onFinally()
        })
};

interface UpdateProps extends Props {
    data: any
}

export const handleUpdate = ({ id, onSuccess, onError, reload, url, onFinally, data }: UpdateProps) => {
    axios.put(url, { ...data, id }).then((res) => {
        onSuccess()
        reload()
    }).catch(err => {
        onError()
    }).finally(() => {
        onFinally()
    })
}
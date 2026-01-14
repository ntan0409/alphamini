import LoadingGif from './loading-gif';

export function Spinner() {
    return (
        <div className="flex items-center justify-center w-full py-12">
            <LoadingGif size="md" showMessage={false} />
        </div>
    )
}
/**
 * Created by t_mit on 4/4/2017.
 */
export async function readUrl(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
    }
    return delay(reader);
}

function delay(reader) {
    return new Promise<void>(function(resolve) {
        reader.onload = (event: any) => {
            resolve(event.target.result);
        };
    });
}
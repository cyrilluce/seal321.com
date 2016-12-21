interface Params{

}
interface FetchData{
    loading: boolean;
    data: any;
    error: any;
}
interface State{
    path: string;
    params: Params;
    initialized: boolean;
    ready: boolean;
    keyword: string;
    searching: boolean;
    page: number;
    size: number;
    result: FetchData;
}
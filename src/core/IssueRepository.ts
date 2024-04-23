import Issue from "./Issue";

export default interface IssueRepository {
    save(issue: Issue): Promise<Issue>
    delete(issue: Issue): Promise<void>
    getAll(): Promise<Issue[]>
}
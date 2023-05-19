import { RpcError, useTodoContext } from "../context/todo";

export default function SearchForm() {
  const todoCtx = useTodoContext();
  let searchInput: HTMLInputElement | undefined;
  let searchFilter: HTMLSelectElement | undefined;

  async function handleSearch(event: Event) {
    event.preventDefault();

    const fetchResponse = await todoCtx.client().fetchTask(undefined, {
      pattern: searchInput.value, filterField: searchFilter.selectedIndex
    });
    if (fetchResponse instanceof RpcError) {
      console.error(`Tasks fetch error: ${fetchResponse.message.replaceAll('%20', ' ')}`)
    } else {
      searchInput.value = ''
      todoCtx.mutate([...fetchResponse.taskList.tasks]);
    }
  }

  return (
    <form onSubmit={handleSearch} class='uk-form-horizontal uk-flex uk-flex-middle'>
      <div class='uk-flex uk-flex-between w-140 ml-4 uk-inline rounded-md border border-solid border-gray-400'>
        <input type='text' placeholder='Search Text' ref={searchInput} name='searchInput'
          class='uk-input uk-width-medium uk-form-blank w-100%' required
        />
        <div class='uk-flex uk-flex-middle'>
          <label class='uk-text-light text-gray-400 ml-2'>In</label>
          <div uk-form-custom='target: > * > span:first-child'
            class='ml-2 w-40 uk-inline'
          >
            <select id='filtersearch' aria-label='Custom controls' required
              ref={searchFilter}
            >
              <option value='0' class='uk-text-bold'>Title & Desc</option>
              <option value='1' class=''>Title</option>
              <option value='2' class=''>Description</option>
            </select>
            <button class='uk-button uk-button-text w-40 uk-text-right' type='button' tabindex='-1'>
              <span></span>
              <span class='i-mdi-chevron-down w-10 h-5 uk-button uk-button-small' />
            </button>
          </div>
        </div>
        <button type='submit' class='uk-button uk-button-default uk-button-small'>
          <span class='i-mdi-feature-search-outline w-10 h-5 uk-button uk-button-small' />
        </button>
      </div>
    </form >

  );
}

import { Navigate } from "@solidjs/router";
import { Show } from "solid-js";
import { useTodoContext } from "../context/todo";

export default function Tasks() {
  const todoClient = useTodoContext();

  return (
    <section class='uk-flex uk-flex-column uk-flex-middle'>
      <div>
        <h2>Tasks goes here...</h2>
      </div>
      <Show when={!todoClient.todoApi()}>
        <Navigate href={'/signin'} />
      </Show>
    </section>
  );
}

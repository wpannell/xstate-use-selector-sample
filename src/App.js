import { createMachine, interpret, assign } from "xstate";
import { useSelector, useInterpret } from "@xstate/react";
import { useEffect } from "react";
import "./styles.css";

const machine = createMachine({
  id: "test",
  initial: "idle",
  context: {
    one: false,
    two: false
  },
  states: {
    idle: {
      on: {
        WORK: { target: "working" }
      }
    },
    working: {
      invoke: {
        src: () => {
          return Promise.resolve({ one: true, two: true });
        },
        onDone: {
          actions: assign((ctx, evt) => {
            return {
              ...ctx,
              ...evt.data
            };
          })
        }
      }
    }
  }
});

const service = interpret(machine);

export default function App() {
  useEffect(() => service.start(), []);
  // const service = useInterpret(machine)

  const one = useSelector(service, (state) => state.context.one);
  const two = useSelector(service, (state) => state.context.two);

  console.log({ one, two });

  useEffect(() => {
    if (!one || !two) {
      service.send("WORK");
    }
  }, [one, two]);

  return (
    <div className="App">
      <p>one: {String(one)}</p>
      <p>two: {String(two)}</p>
    </div>
  );
}

type Result = Error of string | Success

printfn "%A" ((fun x y -> x y) ((fun k f -> f(f(k))) 3))

printfn "Hello from F#"

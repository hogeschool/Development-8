module First

let rec lineGaps (length : int) (gap : int) : string =
  if length = 0 then
    ""
  else if length % gap = 0 then
    (lineGaps (length - 1) gap) + " "
  else
    (lineGaps (length - 1) gap) + "*"

let rec concat (l1 : List<'a>) (l2 : List<'a>) : List<'a> =
  match l1,l2 with
  | [],_ -> l2
  | x :: xs,l2 -> x :: (concat xs l2)

type CompressedElement<'a> =
| Corrupted
| Compressed of 'a * int
| Uncompressed of 'a
| Nested of List<CompressedElement<'a>>

type UncompressedElement<'a> =
| Element of 'a
| Error of string

let rec uncompress (l : List<CompressedElement<'a>> ) : List<UncompressedElement<'a>> =
  let rec repeat (x : 'a) (n : int) : List<'a> =
    match n with
    | 0 -> []
    | _ -> x :: (repeat x (n - 1))
  match l with
  | [] -> []
  | x :: xs ->
      match x with
      | Corrupted -> (Error "Error uncompressing an element") :: (uncompress xs) 
      | Compressed (element, number) ->
           ((repeat element number) |> List.map Element) @ (uncompress xs)
      | Uncompressed x -> (Element x) :: (uncompress xs)
      | Nested l -> (uncompress l) @ (uncompress xs)

type Either<'a,'b> =
| Left of 'a
| Right of 'b

let mapChoice 
  (l : List<'a>) 
  (functions : List<Either<('a -> 'b),('a -> 'c)>>) : Option<List<Either<'b,'c>>> =
  if l.Length <> functions.Length then
    None
  else
    Some(
      List.map2 (
        fun x funChoice ->
          match funChoice with
          | Left f -> Left(f x)
          | Right g -> Right(g x)) l functions
    )

type File =
  {
    Name : string
    Extension : string
  }
  with
    static member Create(name, extension) =
      {
        Name = name
        Extension = extension
      }

type FileSystem =
| Directory of List<File> * List<FileSystem>
| Empty

type SearchOption =
| ByName of string
| ByExtension of string

let rec search (option : SearchOption) (fs : FileSystem)  : List<File> =
  match fs with
  | Empty -> []
  | Directory (files,subdirectories) ->
      (files |>
        List.filter(
          fun f ->
            match option with
            | ByName name -> f.Name.Contains(name)
            | ByExtension ext -> f.Extension = ext)) @
                (subdirectories |> ((List.map (search option)) >> (List.concat)))

let testAll() =
  printfn "1: %s" (lineGaps 7 3)
  printfn "2: %A" (concat [9;9;9] [9;9;9;7;2])
  let compressed =
    [
      Compressed('x', 5)
      Nested
        [
          Compressed('y', 4)
          Uncompressed 'x'
          Nested
            [
              Compressed('y', 3)
              Uncompressed 'z'
              Compressed('w', 3)
            ]
          Compressed('x', 4)
        ]
      Nested
        [
          Compressed('A', 3)
          Compressed('B', 2)
          Uncompressed 'C'
        ]
    ]
  printfn "3: %A" (uncompress compressed)
  let elements = [5;0;2;4;3;15;2]
  let functions =
    [for x in 0..elements.Length - 1 do
      if x % 2 = 0 then
        yield Left(fun x -> x + 2)
      else
        yield Right(fun x -> sprintf "%d" (x + 3))]
  printfn "4: %A" (mapChoice elements functions)
  let (fileSystem : FileSystem) =
    Directory(
      [
        File.Create("a","exe")
        File.Create("ab","exe")
        File.Create("ac","exe")
      ],
      [
        Directory(
          [
            File.Create("t","txt")
            File.Create("u","doc")
          ],
          [Empty]
        )
        Directory(
          [
            File.Create("xxx","doc")
            File.Create("bs","doc")
            File.Create("ax","csv")
          ],
          [Empty]
        )
      ]
    )
  printfn "5a: %A" (search (ByExtension "doc") fileSystem)
  printfn "5b: %A" (search (ByName "a") fileSystem)
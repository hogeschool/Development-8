namespace SQL 
{
  interface Expression { }

  class Plus : Expression
  {
    public Expression Left { get; set; }
    public Expression Right { get; set; }

  }  
}


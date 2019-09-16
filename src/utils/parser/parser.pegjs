ConjunctionNormalForm
  = head:Implies operator:AndSpace tail:ConjunctionNormalForm {
  	return {
      name: 'and',
      clauses: [head, tail]
    }
  }
  / Implies

Implies
  = head:Or space operator:'implies' space tail:Implies {
  return {
      name: operator,
      clauses: [head, tail]
    }
  }
  / Or

Or
  = head:Not space operator:'or' space tail:Or {
  	return {
      name: operator,
      clauses: [head, tail]
    }
  }
  / Not

Not
  = operator:'not' space tail:Not {
    return {
      name: operator,
      clauses: [tail]
    }
  }
  / Subclause
  / Variable

Subclause
  = "(" _ clause:Implies _ ")" {
    return clause
  }

Variable
  = val:[^ \t\n\r,()$-]+ {
  	return {
    	name: 'variable',
        value: val.join('')
    }
  }
space
  = ' '+

_ "whitespace"
  = [ \t\r]*


AndSpace
  = [\t\r ]*[\n][\n\t\r ]*

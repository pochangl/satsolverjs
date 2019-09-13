Expression
  = _ expression:Implies _ {
  	return expression
  }

Subclause
  = "(" _ clause:Implies _ ")" {
    return clause
  }

Implies
  = head:Or space operator:'implies' space tail:Implies {
  return {
      name: operator,
      clauses: [head, tail]
    }
  }
  / Or


Or
  = head:And space operator:'or' space tail:Or {
  	return {
      name: operator,
      clauses: [head, tail]
    }
  }
  / And

And
  = head:Not space operator:'and' space tail:And {
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

Variable
  = val:[^ \t\n\r,()]+ {
  	return {
    	name: 'variable',
        value: val.join('')
    }
  }
space
  = ' '+

_ "whitespace"
  = [ \t\n\r]*

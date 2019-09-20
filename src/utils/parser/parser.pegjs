ConjunctionNormalForm
  = head:Implies operator:AndSpace tail:ConjunctionNormalForm {
  	return {
      name: 'and',
      type: 'junction',
      clauses: [head, tail]
    }
  }
  / Implies

Implies
  = head:Or space operator:'implies' space tail:Implies {
  return {
      name: operator,
      type: 'junction',
      clauses: [head, tail]
    }
  }
  / Or

Or
  = head:And space operator:'or' space tail:Or {
  	return {
      name: operator,
      type: 'junction',
      clauses: [head, tail]
    }
  }
  / And

And
  = head:Not space operator:'and' space tail:And {
  	return {
      name: operator,
      type: 'junction',
      clauses: [head, tail]
    }
  }
  / Not

Not
  = operator:'not' space tail:Not {
    return {
      name: operator,
      type: 'prefix',
      clauses: [tail]
    }
  }
  / Atomic

Atomic = Subclause
  / AtLeastOne
  / AtMostOne
  / OnlyOne
  / Variable

Subclause
  = '(' _ clause:Implies _ ')' {
    return clause
  }

AtLeastOne
  = 'at least ' num:[1] ' of' _ clauses:Set {
    return {
      name: 'at least',
      type: 'prefix',
      value: num,
      clauses: clauses
    }
  }

AtMostOne
  = 'at most ' num:[1] ' of' _ clauses:Set {
    return {
      name: 'at most',
      type: 'prefix',
      value: num,
      clauses: clauses
    }
  }
OnlyOne
  = 'only ' num:[1] ' of' _ clauses:Set {
    return {
      name: 'one',
      type: 'prefix',
      value: num,
      clauses: clauses
    }
  }

Variable
  = val:[^ \t\n\r,()$\-{}]+ {
  	return {
    	name: 'variable',
      type: 'atomic',
      value: val.join('')
    }
  }

space
  = ' '+

_ 'whitespace'
  = [ \t\r]*


Set =
  '{' clauses: ((_ Variable _ [,])* _  Variable _ ) '}' {
    let array = clauses[0].map(function (c) { return c[1] })
    array.push(clauses[2])
    return array
  }

AndSpace
  = [\t\r ]*[\n][\n\t\r ]*

Expression
  = _ expr:(ClauseChainOperator / Clause) _ {
  	return expr
  }

ClauseChainOperator
  = head:Clause space operator:'implies' space tail:(ClauseChainOperator / Clause) {
  	return {
      name: operator,
      clauses: [head, tail]
    }
  }

Clause
  = klause:(Subclause / ChainOperator / BindOperator / Prefix / Atomic) {
    return klause
  }

ChainOperator
  = head: (Subclause / BindOperator / Prefix / Atomic) space operator:'or' space tail: Clause {
  	return {
      name: operator,
      clauses: [head, tail]
    }
  }

BindOperator
  = left:(Subclause / Prefix / Atomic) space operator:'and' space right:Clause {
  	return {
      name: operator,
      clauses: [left, right]
    }
  }

Prefix
  = 'not' space tail:Clause {
    return {
      name: 'not',
      clauses: [tail]
    }
  }

Subclause
  = "(" _ clause:Clause _ ")" {
    return {
      name: 'clause',
      clauses: [
        clause
      ]
    }
  }

Atomic
  = val:Name {
  	return {
    	name: 'atomic',
        value: val.join('')
    }
  }

Name
  = [^ \t\n\r,]+

Set
  = "{" clause: ( _ Atomic _ [,] )* "}"

space
  = ' '+

_ "whitespace"
  = [ \t\n\r]*

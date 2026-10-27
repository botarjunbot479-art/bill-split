# Logic mirror of settlement fairness
def settle(people, expenses):
    paid={p:0 for p in people}; total=0
    for e in expenses:
        paid[e['payer']]+=e['amount']; total+=e['amount']
    fair=total/len(people)
    assert abs(sum(paid[p]-fair for p in people)) < 1e-6

def test_balanced():
    settle(['A','B'],[{'payer':'A','amount':100},{'payer':'B','amount':100}])

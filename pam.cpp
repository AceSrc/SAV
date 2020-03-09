int getfail(int x){
    while(s[n-tree[x].len-1]!=s[n]) x=tree[x].fail;
    return x;
}

void extend(int x){
    int cur=getfail(last);
    if(!tree[cur].son[x]){
        int now=++num;
        tree[now].len=tree[cur].len+2;
        tree[now].fail=tree[getfail(tree[cur].fail)].son[x];
        tree[cur].son[x]=now;
    }
    tree[tree[cur].son[x]].siz++;
    last=tree[cur].son[x];
}
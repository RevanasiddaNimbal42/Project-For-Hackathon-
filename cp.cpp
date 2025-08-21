#include "bits/stdc++.h"
// #define submit
using namespace std;

void solve(){
  int l,r;
  cin>>l>>r;
  if(l==1 && r==1){
    cout<<"1"<<"\n";
  }else{
  
  cout<<r-l<<"\n";
}
}
    

int main(){
    #ifndef submit
        freopen("input.txt", "r", stdin);
        freopen("output.txt", "w", stdout);
        // freopen("degub.txt", "w", stderr);
    #endif
    int t;
    cin >> t;
    while(t--)
        solve();
    return 0;
}
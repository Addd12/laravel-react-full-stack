<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    public function signup(SignupRequest $request){
        $data = $request->validated(); //validate input data
        //create user and save it to $user variable
        /** @var \App\Models\User $user */
        $user = User::create([
            'name'=> $data['name'],
            'email'=> $data['email'],
            'password'=>bcrypt($data['password']),
        ]);

        //$user = new User();
        $token = $user->createToken('main')->plainTextToken;

        return response(compact('user', 'token'));
    }

    public function login(LoginRequest $request){
       $credentials = $request->validated();
       //we check if the credetials are wrong
       if(!Auth::attempt($credentials)){
            return response([
                'message'=> 'Provided email address or password is incorrect'
            ]);
        } 
        /** @var User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }
    public function logout(Request $request){
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }
}

import { NextResponse } from 'next/server';

export type ApiResponse<T> = Promise<NextResponse<T | { error: string }>>;

import type { TAnySchema } from '@sinclair/typebox';
export declare const benchmark: <T extends TAnySchema>(model: T, value: T["static"]) => void;
